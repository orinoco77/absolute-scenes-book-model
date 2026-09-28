export const normalizeContent = content => {
  if (typeof content !== 'string') return content;
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};
