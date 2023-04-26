const { clear } = require('console');
const readline = require('readline');
//methode für eine beliebige 4 stellige zahl die nicht mit null beginnen darf und keine zahl doppet sein darf
function generateNumber() 
{
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const number = [];

  for (let i = 0; i < 4; i++) 
  {
    const randomIndex = Math.floor(Math.random() * digits.length);
    number.push(digits[randomIndex]);
    digits.splice(randomIndex, 1);
  }

  return number;
};
// der input darf nicht mit null anfangen und muss 4 stellen haben 
function isValidInput(input) 
{
  return /^[1-9][0-9]{3}$/.test(input);
};
// einen abgleich für die nummer die durch das terminal eingebeb wird 
// dieser abgleich zählt COWS oder BULLS hoch 
// COWS sind nummern die richtig sind aber an der falschen stelle stehen
// Bulls sind zahlen die richtig sind und an der richtigen stelle stehen 
function compareNumbers(guess, answer) 
{
  let cows = 0;
  let bulls = 0;

  for (let i = 0; i < 4; i++) 
  {
    if (guess[i] === answer[i]) 
    {
      bulls++;
    } 
    else if (answer.includes(guess[i])) 
    {
      cows++;
    }
  };

  return { bulls, cows };
};

function getRandomMessage() 
{
  const messages = 
  [
    'Das war knapp daneben!',
    'Keine Sorge, du schaffst das noch!',
    'Vielleicht solltest du mal eine Pause machen und dann weitermachen.',
    'Das war nicht das, was wir suchen.',
    'Leider nicht die richtige Kombination.',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

function rules()
{
    // const rule =
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log();
        console.log("Regeln:");
        console.log();
        console.log("Eine geheime Nummer wird erstellt");
        console.log("sobald COWS hoch gezählt wird bedeutet das in deiner erraten Zahl eine Zahl drin ist die richtig ist aber an der falschen stelle steht!");
        console.log("sobald BULLS hoch gezählt wird ist eine der zahlen an der richtigen stelle");
        console.log("man startet immer im easy mode wo du 30 versuche hast im hard mode hast du nur die hälfte an versuchen");
        console.log();
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");


    // return rule;
    
};
async function startGame() 
{
    let name = '';
    let level = 'easy';
    let gamesPlayed = 0;
    let totalAttempts = 0;
    console.clear();
    console.log("=======================================");
    console.log("---> Willkommen zu Cows and Bulls! <---");
    console.log("=======================================");
    console.log();


    const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    });

    while (!name) 
    {
        name = await new Promise(resolve => 
        {
            rl.question("Wie lautet dein Name? (Optional) ", resolve);
        });
    }

    console.log(`Hallo ${name}! Versuche die geheime vierstellige Zahl zu erraten. `);
    rules();
    


    while (true) 
    {
        gamesPlayed++;
        const answer = generateNumber();
        let attempts = 0;

        console.log(`Runde ${gamesPlayed} - ${level} Modus`);
    
        while (true) 
        {
            const input = await new Promise(resolve => 
            {
                rl.question('Gib eine vierstellige Zahl ohne führende Nullen ein: ', resolve);
            });

            if (!isValidInput(input)) 
            {
                console.log('Ungültige Eingabe. Bitte gib eine vierstellige Zahl ohne führende Nullen ein.');
                continue;
            }

            attempts++;
 
            const guess = input.split('').map(Number);
            const result = compareNumbers(guess, answer);
        
            if (result.bulls === 4) 
            {
                console.log("-------------------------------------------------------------------");
                console.log();
                console.log(`Herzlichen Glückwunsch ${name}! Du hast die Zahl in ${attempts} Versuchen erraten.`);
                console.log();
                console.log("-------------------------------------------------------------------");
            

                totalAttempts += attempts;
            break;
            } 
            else if (attempts === 30 && level === 'easy') 
            {
                console.log("-------------------------------------------------------------------");
                console.log();
                console.log(`Du hast leider keine Versuche mehr übrig! Die richtige Antwort war ${answer.join('')}.`);
                console.log();
                console.log("-------------------------------------------------------------------");

            break;

            }
       
            else if (attempts === 15 && level === 'hard') 
            {
                console.log("-------------------------------------------------------------------");
                console.log();
                console.log(`Du hast leider keine Versuche mehr übrig! Die richtige Antwort war ${answer.join('')}.`);
                console.log();
                console.log("-------------------------------------------------------------------");

            break;
            } 
            else 
            {
                console.log("-------------------------------------------------------------------");
                console.log();
                console.log(`${result.cows} COWS, ${result.bulls} BULLS. Versuch : ${attempts}`);
                console.log();
                console.log("-------------------------------------------------------------------");

                if (result.cows === 0 && result.bulls === 0) 
                {
                    console.log("-------------------------------------------------------------------");
                    console.log();
                    console.log(getRandomMessage());
                    console.log();
                    console.log("-------------------------------------------------------------------");
                }
            }
        }



        const playAgain = await new Promise(resolve => 
        {
            rl.question('Möchtest du nochmal spielen? (Ja/Nein) ', resolve);
        });

        if (playAgain.toLowerCase() === 'nein') 
        {
            console.log(`Danke fürs Spielen, ${name}! Du hast insgesamt ${gamesPlayed} Runden gespielt und durchschnittlich ${totalAttempts } Versuche gebraucht.`);
            rl.close();
        break;
        } 
        else 
        {
            const newLevel = await new Promise(resolve => 
            {
                rl.question('Möchtest du den Schwierigkeitsgrad ändern? (Ja/Nein) ', resolve);
            });

            if (newLevel.toLowerCase() === 'ja') 
            {
                level = level === 'easy' ? 'hard' : 'easy';
            };
        };

    };
};

startGame();