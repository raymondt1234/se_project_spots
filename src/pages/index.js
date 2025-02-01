import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";
import "./index.css";
import { setButtonText } from "../utils/helpers.js";
import spotsLogoSrc from "../images/logo.svg";
import pencilIconSrc from "../images/pencil.svg";
import plusIconSrc from "../images/plus.svg";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c126eeac-2056-47be-9b3c-8d9b16bc2f4d",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      renderCard(card);
    });
    return user;
  })
  .then((user) => {
    profileAvatar.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch(console.error);

const logoImage = document.getElementById("spots-logo");
logoImage.src = spotsLogoSrc;
const profileAvatar = document.getElementById("profile-avatar");
const pencilIcon = document.getElementById("pencil-icon");
pencilIcon.src = pencilIconSrc;
const plusIcon = document.getElementById("plus-icon");
plusIcon.src = plusIconSrc;

enableValidation(settings);

// Profile
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Edit Profile Avatar Button
const profileAvatarButton = document.querySelector(".profile__avatar-btn");

// Edit Profile Avatar
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-btn");
const avatarLink = editAvatarModal.querySelector("#profile-avatar-input");
const avatarFormElement = document.forms["edit-profile-avatar"];

// Edit Profile Modal
const editModal = document.querySelector("#edit-profile-modal");
const profileModalName = editModal.querySelector("#profile-name-input");
const profileModalDescription = editModal.querySelector(
  "#profile-description-input"
);
const profileFormElement = document.forms["edit-profile"];

// New Post Button
const newPostButton = document.querySelector(".profile__add-btn");

// New Post Modal
const newPostModal = document.querySelector("#add-card-modal");
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

// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["delete-form"];

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  if(data.isLiked) {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardImageElement.addEventListener("click", handleOpenPreview);
  cardLikeBtn
    .addEventListener("click", (event) => handleLiked(event, data._id));
  cardElement
    .querySelector(".card__delete-btn")
    .addEventListener("click", () => handleDeleteCard(cardElement, data._id));

  return cardElement;
}

// Opens modal to delete card can be either submitted or canceled
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLiked(event, cardId) {
  const isLiked = event.target.classList.contains("card__like-btn_liked");

  api.updateLikes(cardId, isLiked)
  .then(() => {
    event.target.classList.toggle("card__like-btn_liked");
  })
  .catch(console.error);

}

function handleOpenPreview(event) {
  const previewImage = event.target;

  previewModalImage.src = previewImage.src;
  previewModalImage.alt = previewImage.alt;
  previewModalCaption.textContent = previewImage.alt;

  openModal(previewModal);
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function openModal(modal) {
  document.addEventListener("keydown", handleEscClose);
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  document.removeEventListener("keydown", handleEscClose);
  modal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(event) {
  event.preventDefault();

  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);

  api.editUserInfo({name: profileModalName.value, about: profileModalDescription.value})
  .then(data => {
    profileName.textContent = data.name;
    profileDescription.textContent = data.about;

    closeModal(editModal);
  })
  .catch(console.error)
  .finally(() => {
    setButtonText(submitBtn, false);
  });
}

function handleAvatarFormSubmit(event) {
  event.preventDefault();

  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);

  api.editUserAvatar({avatar: avatarLink.value})
  .then(data => {
    profileAvatar.src = data.avatar;

    event.target.reset();
    closeModal(editModal);
  })
  .catch(console.error)
  .finally(() => {
    setButtonText(submitBtn, false);
  });
}

function handleNewPostFormSubmit(event) {
  event.preventDefault();

  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);

  const card = {
    link: newPostLink.value,
    name: newPostName.value,
  };

  api.addCard(card)
  .then(() => {
    renderCard(card);

    disableButton(newPostSubmitBtn, true, settings);
    event.target.reset();

    closeModal(newPostModal);
  })
  .catch(console.error)
  .finally(() => {
    setButtonText(submitBtn, false);
  });
}

// Handles Delete Form Submission
function handleDeleteSubmit(event) {
  event.preventDefault();

  const submitBtn = event.target;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api.deleteCard(selectedCardId)
  .then(() => {
    selectedCard.remove();
    closeModal(deleteModal);
    selectedCard = "";
    selectedCardId = "";
  })
  .catch(console.error)
  .finally(() => {
    setButtonText(submitBtn, false, "Delete", "Deleting...");
  });
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

profileEditButton.addEventListener("click", () => {
  profileModalName.value = profileName.textContent;
  profileModalDescription.value = profileDescription.textContent;

  resetValidation(
    editModal,
    [profileModalName, profileModalDescription],
    settings
  );

  openModal(editModal);
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

deleteForm.addEventListener("click", handleDeleteSubmit);

profileAvatarButton.addEventListener("click", () => {
  openModal(editAvatarModal);
});

newPostFormElement.addEventListener("submit", handleNewPostFormSubmit);

const modals = document.querySelectorAll(".modal");

// add event listener to close modals
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("modal_opened")) {
      closeModal(modal);
    }
    if (event.target.classList.contains("modal__close-btn")) {
      closeModal(modal);
    }
  });
});
