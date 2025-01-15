// export const getImageUrl = (path) => {
//     return new URL(`/assets/${path}`, import.meta.url).href;
// };


export const getImageUrl = (path) => {
    // Return the base path without using process.env in the browser context
    return `/assets/${path}`;
};








