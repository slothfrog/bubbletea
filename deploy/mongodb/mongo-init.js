db.createUser({
  user: 'pepe',
  pwd: 'cscc09project',
  roles: [
    {
      role: 'readWrite',
      db: 'pepesbubblesDB',
    },
  ]
});

