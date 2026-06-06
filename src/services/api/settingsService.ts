export const settingsService = {
  /**
   * Updates the user's personal profile settings.
   */
  async updateUserProfile(profileData: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('User profile settings updated.', profileData);
  },

  /**
   * Uploads a new avatar image for the user.
   */
  async uploadAvatar(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
