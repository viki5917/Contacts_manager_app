//npm i express-async-handler
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (request, response) => {
  const contacts = await Contact.find({ user_id: request.user.id });
  response.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (request, response) => {
  console.log("The request body is", request.body);
  const { name, email, phone } = request.body;
  if (!name || !email || !phone) {
    response.status(400);
    throw new Error("All fields are mandatory!");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: request.user.id,
  });
  response.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (request, response) => {
  const contact = await Contact.findById(request.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found!");
  }
  response.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (request, response) => {
  const contact = await Contact.findById(request.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found!");
  }
  if (contact.user_id.toString() !== request.user.id) {
    response.status(403);
    throw new Error("User don't have permission to update other user contact");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  response.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (request, response) => {
  const contact = await Contact.findById(request.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found!");
  }
  if (contact.user_id.toString() !== request.user.id) {
    response.status(403);
    throw new Error("User don't have permission to delete other user contact");
  }
  await Contact.deleteOne({ _id: request.params.id });
  response.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
