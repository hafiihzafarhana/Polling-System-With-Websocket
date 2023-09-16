import { Nominations, Rankings, Results } from 'shared';

export function getResult(
  rankings: Rankings,
  nominations: Nominations,
  votesPerVoter: number,
): Results {
  const scores: { [nominationId: string]: number } = {};

  // [ [ '2mMkXYVN', 'wmgVkC95' ] ]
  Object.values(rankings).forEach((userRankings) => {
    // [ '2mMkXYVN', 'wmgVkC95' ]
    userRankings.forEach((nominationId, n) => {
      // 2mMkXYVN (1)
      // wmgVkC95 (0.5625)
      const voteValue = Math.pow(
        (votesPerVoter - 0.5 * n) / votesPerVoter,
        n + 1,
      );

      // 1) pilihan pertama, kedua, ketiga dst akan berbeda.
      // 2) Pilihan pertama akan memiliki nilai besar
      scores[nominationId] = (scores[nominationId] ?? 0) + voteValue;
      console.log(scores[nominationId], nominationId);
    });
  });
  console.log('====================================================');
  console.log(scores);
  //   [
  //     ['2mMkXYVN', 2],
  //     ['wmgVkC95', 1.5625],
  //   ];
  //   Object.entries(scores)

  //   [ { data: [ '2mMkXYVN', 2 ] }, { data: [ 'wmgVkC95', 1.5625 ] } ]
  const results = Object.entries(scores).map(([nominationId, score]) => ({
    nominationId,
    score,
    nominationText: nominations[nominationId].text,
  }));
  //   console.log(scores);

  results.sort((res1, res2) => res2.score - res1.score);

  return results;
}
