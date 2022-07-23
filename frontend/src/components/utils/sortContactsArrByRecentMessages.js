export const sortContactsArrByRecentMessages = userContactArr => {
  return userContactArr.sort((a, b) => {
    if (a.recentMessage?.created_at > b.recentMessage?.created_at) return -1;
    if (b.recentMessage?.created_at > a.recentMessage?.created_at) return 1;
    else return 0;
  });
};
