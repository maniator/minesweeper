import { expandOutFromBlock } from "./expandOutFromBlock";

export const calculateEmptySpacesOnBoard = ({ board, row, column }, checkedPoints = {}, passThrough = false) => {
    return expandOutFromBlock({ board, row, column, autoClick: true }, checkedPoints, ({ point }) => {
       return {
           passThrough: (point.value === 0 && !point.containsBomb) || passThrough,
       };
    });
};
