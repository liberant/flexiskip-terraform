
/* eslint no-plusplus: 0 */

/**
 * normalize file name for uploading to s3
 *
 * @param {String} str
 */
export function getSafeFilename(strParam) {
  if (!strParam) {
    return '';
  }

  let str = strParam.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  return str
    .replace(/(?![.])[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
}
