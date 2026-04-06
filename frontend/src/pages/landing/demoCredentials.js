/**
 * Mirrors seeded users from backend/src/shared/database/seedDatabase.js
 * Used only for demo UI autofill — not for authentication.
 */
export const DEMO_USERS = {
  reporter: {
    email: "johndoe@gmail.com",
    password: "reporter123",
    role: "reporter",
  },
  responder: {
    email: "responder@safereport.com",
    password: "responder123",
    role: "responder",
  },
  admin: {
    email: "admin@safereport.com",
    password: "admin123",
    role: "admin",
  },
};

/** Default demo shown on the card (reporter — primary app flow). */
export const PRIMARY_DEMO = DEMO_USERS.reporter;
