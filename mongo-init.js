db.createUser({
  user: 'feedback_user',
  pwd: 'feedback_password',
  roles: [
    {
      role: 'readWrite',
      db: 'feedback_db',
    },
  ],
}); 