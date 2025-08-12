export async function updateReviewCounts(tx, { bookId, userId, operation }) {
  const operationValue = operation === 'increment' ? { increment: 1 } : { decrement: 1 };

  await Promise.all([
    tx.book.update({
      where: { id: bookId },
      data: { reviewCount: operationValue },
    }),
    
    tx.user.update({
      where: { id: userId },
      data: { reviewCount: operationValue },
    }),
  ]);
}