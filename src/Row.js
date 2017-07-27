import React from 'react';
import style from 'styled-components';
import {Block} from "./Block";

const RowWrapper = style.div`
    display: flex;
`;

export const Row = ({ currentRow, id, rowIndex, onBoxClick }) => {
    const blocks = currentRow.map((blockData, index) => <Block
        key={`block_${index}_${id}`}
        index={index}
        rowIndex={rowIndex}
        onBoxClick={onBoxClick}
        data={blockData}
    />);

    return (
        <RowWrapper>
            {blocks}
        </RowWrapper>
    );
};