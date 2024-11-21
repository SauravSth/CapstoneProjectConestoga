// Helper function to get initials from the first and last name
const getInitials = (name) => {
  const nameParts = name.split(' ');
  const firstInitial = nameParts[0]?.[0] || '';
  const lastInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export default getInitials;
