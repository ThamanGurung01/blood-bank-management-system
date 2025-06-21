import { v4 as uuid } from 'uuid';

export function getUniquePublicId(originalName: string): string {
  const parts = originalName.split('.');
  const extension = parts.length > 1 ? parts.pop() : '';
  const nameWithoutExt = parts.join('.') || 'file';

  const uniqueSuffix = uuid().replace(/-/g, '');
  const sanitized = nameWithoutExt.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

  return extension
    ? `${sanitized}_${uniqueSuffix}.${extension}`
    : `${sanitized}_${uniqueSuffix}`;
}