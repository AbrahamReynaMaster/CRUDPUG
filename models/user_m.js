const mongoose = require('mongoose');

// crud_sch schema
const crudSchema = mongoose.Schema({
    nick: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  },
  email: {
      type: String,
      required: true
  }
});

const user = module.exports = mongoose.model('user', crudSchema);