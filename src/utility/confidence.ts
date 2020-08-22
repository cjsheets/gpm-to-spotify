import { Song } from "../types";

export function appendConfidenceLevel(original: Song, matches: Song[] | undefined) {
  if (!matches?.length) {
    return;
  }

  const titleResults = findBestMatch(original.title, matches.map(m => m.title));
  const artistResults = findBestMatch(original.artist, matches.map(m => m.artist));
  const albumResults = findBestMatch(original.album, matches.map(m => m.album));

  return matches.map((match, i) => {
    const sum = titleResults.ratings[i].rating + artistResults.ratings[i].rating

    // When album matches with a high confidence, include it in the calculation
    const confidence = (albumResults.ratings[i].rating > 0.8)
      ? (sum + albumResults.ratings[i].rating) / 3
      : sum / 2;

    return {...match, confidence}
  }).sort((a, b) => a.confidence > b.confidence ? -1 : 1)
    .map(m => ({...m, confidence: `${Math.round((m.confidence || 0) * 100)}%`}))
}


/*
 * [ aceakash / string-similarity ](https://github.com/aceakash/string-similarity)
 *  - MIT License
 */
export function findBestMatch(mainString: string, targetStrings: string[]) {
	const ratings = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compareTwoStrings(mainString, currentTargetString)
		ratings.push({target: currentTargetString, rating: currentRating})
		if (currentRating > ratings[bestMatchIndex].rating) {
			bestMatchIndex = i
		}
	}
	
	
	const bestMatch = ratings[bestMatchIndex]
	
	return { ratings, bestMatch, bestMatchIndex };
}

function compareTwoStrings(first: string, second: string) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (!first.length && !second.length) return 1;
	if (!first.length || !second.length) return 0;
	if (first === second) return 1;
	if (first.length === 1 && second.length === 1) return 0;
	if (first.length < 2 || second.length < 2) return 0;

	let firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram) + 1
			: 1;

		firstBigrams.set(bigram, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram)
			: 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}