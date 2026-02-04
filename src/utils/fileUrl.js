const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const fileBase = import.meta.env.VITE_FILE_BASE_URL || apiBase.replace(/\/api$/, '');

export const buildFileUrl = (url) => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return `${fileBase}${url.startsWith('/') ? url : `/${url}`}`;
};

export const getFileUrl = (filename) => {
  if (!filename) return '#';
  if (/^https?:\/\//i.test(filename)) return filename;
  return `${fileBase}/uploads/${filename}`;
};
