import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Note, NoteCard} from './NoteCard';
import {Card} from '@gravity-ui/uikit';
import './styles.css';
import {ExpandedNoteCard} from './ExpandedNoteCard';

interface ShowNotesModalProps {
    notes: Note[];
    open: boolean;
    // open: boolean;
}

export const ShowNotesModal = ({notes, open}: ShowNotesModalProps) => {
    const [columns, setColumns] = useState<ReactElement[][]>([[], []]);
    const refs = useRef<Array<HTMLDivElement | null>>([]);
    useEffect(() => {
        const newColumns: ReactElement[][] = [[], []]; // Adjust number of columns if needed
        const heights = [0, 0]; // Track height of each column

        notes.forEach((item, index) => {
            item.index = index;
            const shortestIndex = heights.indexOf(Math.min(...heights));
            newColumns[shortestIndex].push(
                <div
                    key={index}
                    ref={(el) => {
                        refs.current[index] = el;
                    }}
                >
                    <NoteCard note={item} setSelectedCard={setSelectedCard} />
                </div>,
            );
            console.log(refs.current[index]?.offsetHeight); // Simulate height (improve logic as needed)
            heights[shortestIndex] += refs.current[index]?.offsetHeight || 0;
        });

        setColumns(newColumns);
    }, [notes]);
    const [selectedCard, setSelectedCard] = useState(null as any);
    return (
        <motion.div
            style={{
                position: 'absolute',
                padding: '8px',
                borderRadius: '4px',
                transform: `translate(30%, -50%)`,
                opacity: 0,
                // bottom: '-50%',
                // transform: `translate('120%', -50%)`,
            }}
            animate={{
                width: open === true ? 250 : 0,
                opacity: open === true ? 1 : 0,
                transform: open === true ? `translate(120%, -50%)` : `translate(30%, -50%)`,
                // left: open ? 0 : 500,
            }}
        >
            {/* {selectedCard ? (
                <ExpandedNoteCard note={selectedCard} setSelectedCard={setSelectedCard} />
            ) : ( */}
            <Card
                className="masonry-layout"
                style={
                    {
                        position: 'relative',
                        // zIndex: !open ? 0 : 'auto',
                        pointerEvents: open ? 'auto' : 'none',
                        padding: '8px',
                        width: '350px',
                        height: '400px',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '#0002 0px 2px 8px 0px',
                        borderRadius: 8,
                        border: '1px solid #eee2',
                        overflow: 'scroll',
                    } as React.CSSProperties
                }
            >
                {selectedCard ? (
                    <ExpandedNoteCard note={selectedCard} setSelectedCard={setSelectedCard} />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                        }}
                    >
                        {columns.map((column, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                }}
                            >
                                {column}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            {/* )} */}
        </motion.div>
    );
};
