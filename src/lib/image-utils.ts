const isProd = process.env.NODE_ENV === "production";
const REPO_NAME = "erastus-murungi.github.io";

export const getImageUrl = (image: string) => {
  return isProd ? `/${REPO_NAME}/${image}` : image;
};
