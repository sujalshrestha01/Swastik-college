import { deleteUploadedFile } from './cloudinaryHelpers.js';

function toFilter(idOrFilter) {
  return typeof idOrFilter === 'string' ? { _id: idOrFilter } : idOrFilter;
}

/**
 * Drop-in replacement for `Model.findByIdAndUpdate` / `findOneAndUpdate`
 * that also deletes any file fields being replaced or cleared.
 *
 * @param Model       Mongoose model
 * @param idOrFilter  either a document id (string) or a query filter object
 *                    (e.g. { slug: req.params.slug })
 * @param updates     req.body
 * @param fileFields  array of field names that hold an uploaded file's URL,
 *                    e.g. ['photoUrl'] or ['logoUrl', 'imageUrl']
 */
export async function updateWithFileCleanup(Model, idOrFilter, updates, fileFields, options = { new: true, runValidators: true }) {
  const filter = toFilter(idOrFilter);
  const existing = await Model.findOne(filter);
  if (!existing) return null;

  for (const field of fileFields) {
    if (field in updates && updates[field] !== existing[field] && existing[field]) {
      await deleteUploadedFile(existing[field]);
    }
  }

  return Model.findOneAndUpdate(filter, updates, options);
}

/**
 * Drop-in replacement for `Model.findByIdAndDelete` / `findOneAndDelete`
 * that also deletes every file referenced by fileFields on the document.
 */
export async function deleteWithFileCleanup(Model, idOrFilter, fileFields) {
  const filter = toFilter(idOrFilter);
  const doc = await Model.findOneAndDelete(filter);
  if (!doc) return null;

  for (const field of fileFields) {
    if (doc[field]) await deleteUploadedFile(doc[field]);
  }
  return doc;
}

/**
 * For array-of-files fields (e.g. Gallery's `images: [{url}]` or Settings'
 * `heroImages: [url]`) where the whole array is replaced on save rather than
 * one field at a time: deletes any file present in the old array but no
 * longer present in the new one.
 *
 * @param oldUrls  array of URL strings currently in the database
 * @param newUrls  array of URL strings from the incoming update
 */
export async function deleteRemovedArrayFiles(oldUrls = [], newUrls = []) {
  const keep = new Set(newUrls.filter(Boolean));
  for (const url of oldUrls) {
    if (url && !keep.has(url)) await deleteUploadedFile(url);
  }
}