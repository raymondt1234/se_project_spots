const initialCards = [
{
  name: "Val Thorens",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
},
{
  name: "Restaurant terrace",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
},
{
  name: "An outdoor cafe",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
},
{
  name: "A very long bridge, over the forest and through the trees",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
},
{
  name: "Tunnel with morning light",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
},
{
  name: "Mountain house",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
},
{
  name: "Golden Gate bridge",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
}];

// Profile
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Edit Profile Modal
const editModal = document.querySelector("#edit-profile-modal");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const profileModalName = editModal.querySelector("#profile-name-input");
const profileModalDescription = editModal.querySelector("#profile-description-input");
const profileFormElement = document.forms["edit-profile"];

// New Post Button
const newPostButton = document.querySelector(".profile__add-btn");

// New Post Modal
const newPostModal = document.querySelector("#add-card-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostLink = newPostModal.querySelector("#add-card-link-input");
const newPostName = newPostModal.querySelector("#add-card-name-input");
const newPostFormElement = document.forms["edit-card"];

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardImageElement.addEventListener("click", handleOpenPreview);
  cardElement.querySelector(".card__like-btn").addEventListener("click", handleLiked);
  cardElement.querySelector(".card__delete-btn").addEventListener("click", handleDeleteCard);

  return cardElement;
}

function handleDeleteCard(event) {
  event.target.closest(".card").remove();
}

function handleLiked(event) {
  event.target.classList.toggle("card__like-btn_liked");
}

function handleOpenPreview(event) {
  const previewImage = event.target;

  previewModalImage.src = previewImage.src;
  previewModalImage.alt = previewImage.alt;
  previewModalCaption.textContent = previewImage.alt;

  openModal(previewModal);
}

function openModal (modal) {
  modal.classList.add("modal_opened");
};

function closeModal (modal) {
  modal.classList.remove("modal_opened");
};

function handleProfileFormSubmit(event) {
  event.preventDefault();

  profileName.textContent = profileModalName.value;
  profileDescription.textContent = profileModalDescription.value;

  closeModal(editModal);
}

function handleNewPostFormSubmit(event) {
  event.preventDefault();

  const card = {
    link: newPostLink.value,
    name: newPostName.value
  }

  const newPostCard = getCardElement(card);
  cardsList.prepend(newPostCard);

  disableButton(newPostSubmitBtn, true);
  event.target.reset();

  closeModal(newPostModal);
}

function renderCard(item, method = "prepend") {

  const cardElement = getCardElement(item);
  cardsList[ method ](cardElement);
}

profileEditButton.addEventListener("click", () => {
  profileModalName.value = profileName.textContent;
  profileModalDescription.value = profileDescription.textContent;

  resetValidation(editModal, [profileModalName, profileModalDescription]);
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

newPostFormElement.addEventListener("submit", handleNewPostFormSubmit);

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

// create initial cards
initialCards.forEach(card => {
  renderCard(card);
});

