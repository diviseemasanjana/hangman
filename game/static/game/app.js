const csrftoken = getCookie("csrftoken");

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("hello gamer");

  // manage the leaderboard chart
  if (document.querySelector(".guess-container") != undefined) {
    var gameId = document
      .querySelector(".guess-container")
      .getAttribute("data-game-id");

    document
      .querySelector(".submit-guess")
      .addEventListener("click", (event) => {
        event.preventDefault();

        var guessType = document.querySelector("#type").value;
        var guessText = document.querySelector("#guess").value;
        var level = parseInt(
          document.querySelector(".guess-container").getAttribute("data-level")
        );

        // validate
        fetch(`/guess/game_id=${gameId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            guess: guessText,
            type: guessType,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            document.querySelector(".level-content").innerHTML =
              result.game_char;

            // check if the level is completed
            isLevelCompleted = result.game_char.indexOf("_") === -1;

            // receive first badge if you finish first level
            if (isLevelCompleted && level == 1) {
              document.querySelector(".guess-message").innerHTML = `
                      Congratulations!!! You finish your first level and receive a starter's badge.
                      <img src="../../static/game/images/first-badge.jpg" />
                        `;
            } else if (isLevelCompleted) {
              document.querySelector(".guess-message").innerHTML =
                "Congrats!!! \n Level Completed...";
            } else {
              // update the guess result message
              document.querySelector(".guess-message").innerHTML =
                result.message;
            }
            var popup = document.querySelector(".popup");
            var darkBg = document.querySelector(".dark-bg");

            if (popup && darkBg) {
              if (result.correct == true) {
                popup.style.color = "green";
              } else {
                popup.style.color = "red";
              }
              popup.style.display = "block";
              darkBg.style.display = "block";

              document
                .querySelector(".close-message")
                .addEventListener("click", () => {
                  popup.style.display = "none";
                  darkBg.style.display = "none";

                  // check if the game is over, then display game over message
                  if (result.game_over === true) {
                    document.querySelector(".guess-message").innerHTML =
                      "No More Lives Left. Game Over!!!";
                    popup.style.color = "red";
                    popup.style.display = "block";
                    darkBg.style.display = "block";

                    document
                      .querySelector(".close-message")
                      .addEventListener("click", () => {
                        popup.style.display = "none";
                        darkBg.style.display = "none";
                        window.location.href = "/";
                      });
                  }

                  if (isLevelCompleted) {
                    level += 1;
                  }
                  fetch(`/game/level=${level}/new=0`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": csrftoken,
                    },
                  }).then((response) => {
                    window.location.href = response.url;
                  });
                });
            }
          });
      });
  }
});
