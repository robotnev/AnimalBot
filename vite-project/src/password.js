
function displayCards() {
    // Creating two different cards
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    // One for logging in and one for signing
    const signInCard = document.createElement('div');
    signInCard.className = 'card';
    signInCard.textContent = 'Sign In';
    cardContainer.appendChild(signInCard);

    const loginCard = document.createElement('div');
    loginCard.className = 'card';
    loginCard.textContent = 'Login';
    cardContainer.appendChild(loginCard);

    document.body.appendChild(cardContainer);
  }

export default displayCards;
