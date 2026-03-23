const accountService = {
  async getProfile() {
    return {
      fullname: "John Doe",
      email: "johndoe@gmail.com",
      phone: "+254 736 190 7387",
      password: "**********",
      profilePhoto: "",
    };
  },

  async updateProfile(profileData) {
    console.log("Updating profile in backend later:", profileData);
    return { success: true, data: profileData };
  },
};

export default accountService;