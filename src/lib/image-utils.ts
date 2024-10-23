const isProd = process.env.NODE_ENV === "production";

export const getImageUrl = (image: string) => {
  return isProd ? `/${image}` : image;
};
