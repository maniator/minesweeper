import { expandOutFromBlock } from "./expandOutFromBlock";

export const calculateEmptySpacesOnBoard = ({ board, row, column }, checkedPoints = {}, passThrough = false) => {
    let hasNotBeenPassedThrough = true;

    return expandOutFromBlock({ board, row, column, autoClick: true }, checkedPoints, ({ point }) => {
       const expandOut = {
           passThrough: (point.value === 0 && !point.containsBomb) || (passThrough && hasNotBeenPassedThrough),
       };

        hasNotBeenPassedThrough = false;

        return expandOut;
    });
};
