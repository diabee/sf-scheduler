import type { ResourceDTO, ResourceTreeDTO } from '~/types';

/**
 * Get localized name from a resource based on the current language
 * Falls back to the default 'name' field if the localized field is not available
 */
export const getLocalizedName = (
  resource: ResourceDTO | ResourceTreeDTO,
  language: string
): string => {
  if (language === 'en' || language === 'en-US') {
    return resource.nameEn || resource.name;
  }
  if (language === 'zh' || language === 'zh-TW' || language === 'zh-CN') {
    return resource.nameZh || resource.name;
  }
  return resource.name;
};

/**
 * Get localized description from a resource based on the current language
 * Falls back to the default 'description' field if the localized field is not available
 */
export const getLocalizedDescription = (
  resource: ResourceDTO | ResourceTreeDTO,
  language: string
): string => {
  if (language === 'en' || language === 'en-US') {
    return resource.descriptionEn || resource.description;
  }
  if (language === 'zh' || language === 'zh-TW' || language === 'zh-CN') {
    return resource.descriptionZh || resource.description;
  }
  return resource.description;
};
