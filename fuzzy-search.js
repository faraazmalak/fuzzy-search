function fuzzySearch(haystackList, needle, renderer, caseSensitive = false) {
	if (!caseSensitive) {
		needle = needle.toLowerCase();
	}

	/* Check if the match is fuzzy, and assign it a score
		 based on number of letter matches
	      */
	const isFuzzyMatch = function (hayStack) {
		const needleLetters = needle.split("");
		let score = 0;
		let lastSearchedLetter = "";
		needleLetters.forEach(function (letter) {
			if (letter != lastSearchedLetter && hayStack.includes(letter)) {
				score++;
			}
			lastSearchedLetter = letter;
		});
		return score == needle.length;
	};

	// Check if the exact search keyword is found in hayStack
	const isPreciseMatch = function (hayStack) {
		const needleIndex = hayStack.indexOf(needle);
		if (needleIndex == 0) {
			return 2;
		} else if (needleIndex != -1) {
			return 1;
		}
		return false;
	};

	// Sort the fuzzy results, based on the score
	const sortArray = function (list) {
		list.sort(function (a, b) {
			return a.score < b.score ? 1 : -1;
		});
	};

	// Store preciseMatch and fuzzyMatch separately, to avoid running sort on preciseMatch
	let preciseMatch = "";
	let fuzzyMatch = [];
	const hayStackLength = haystackList.length
	for (let i = 0; i < hayStackLength; i++) {
		let searchItem = haystackList[i];
		if (!caseSensitive) {
			searchItem = searchItem.toLowerCase();
		}

		let score = isPreciseMatch(searchItem);

		// Check the score of searchItem and act accordingly
		if (score == 1) {
			preciseMatch += `${haystackList[i]} `;
		} else if (score == 2) {
			preciseMatch = `${haystackList[i]} ${preciseMatch} `;
		} else {
			if (isFuzzyMatch(searchItem)) {
				fuzzyMatch.push({ item: haystackList[i], score });
			}
		}
	}
	//sortArray(fuzzyMatch);
	return renderer(preciseMatch.split(" "), fuzzyMatch);
}

var data = [
	"Crow",
	"Salamander",
	"Crocodile",
	"Chinchilla",
	"Tamarin",
	"Penguin",
	"Anteater",
	"Stingray",
	"Elephant"
];

// Logic to render HTML output
const renderer = function (preciseMatch, fuzzyMatch) {
	let output = null;
	if (preciseMatch.length || fuzzyMatch.length) {
		output = preciseMatch.map((result) => `<li>${result}</li>`).join("");
		output += fuzzyMatch.map((result) => `<li>${result.item}</li>`).join("");
	} else {
		output = "<li>No results found.</li>";
	}
	outputList.innerHTML = output;
	outputList.style.display = "inline-block";
};

const input = document.getElementById("search-input");
const outputList = document.getElementById("search-results");
const searchBox = document.getElementById("search-input");
const caseCheckbox = document.getElementById("case-checkbox");

// Event handler
function searchHandler() {
	outputList.style.display = "none";
	setTimeout(function () {
		fuzzySearch(data, searchBox.value, renderer, caseCheckbox.checked);
	}, 500);
}
