async function withBackoff(fn, { maxRetries = 2 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const isQuotaError = err?.status === 429;
      attempt++;
      if (!isQuotaError || attempt > maxRetries) throw err;

      const retryInfo = err?.details?.find((d) =>
        d["@type"]?.includes("RetryInfo"),
      );
      const delayStr = retryInfo?.retryDelay ?? "1s";
      const delayMs = parseFloat(delayStr) * 1000 || 1000;

      console.warn(
        `Gemini quota hit, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`,
      );
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

export async function generateWithFallback(ai, { contents, config }, models) {
  let lastErr;
  for (const model of models) {
    try {
      return await withBackoff(() =>
        ai.models.generateContent({ model, contents, config }),
      );
    } catch (err) {
      lastErr = err;
      if (err?.status === 429 || err?.status === 404 || err?.status === 503) {
        console.warn(
          `${model} unavailable (${err.status}), trying next model...`,
        );
        continue;
      }
      throw err;
    }
  }
  const quotaError = new Error("QUOTA_EXHAUSTED");
  quotaError.userMessage =
    "The admissions assistant is getting a lot of questions right now and has hit its daily limit. Please try again later, or type \"chat with admin\" to reach our staff directly.";
  quotaError.cause = lastErr;
  throw quotaError;
}