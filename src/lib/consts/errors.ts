export const Errors = {
  mustBeLoggedIn: `You must be logged in to do that`,
  noPermission: `You don't have permission to do that`,
  methodNotAllowed: (method: string) => `Method ${method} not allowed`,
  notFound: (item: string) => `The ${item} you are looking for wasn't found`
};
