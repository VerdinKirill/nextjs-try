'use client';

import {Button, Card, Loader, Popover, Text} from '@gravity-ui/uikit';
import {Note, colors} from './types';
import {CSSProperties, useEffect, useState} from 'react';

import {EditNoteForArt} from './EditNoteForArt';
import ApiClient from '@/utilities/ApiClient';
import {useCampaign} from '@/contexts/CampaignContext';
import {cx} from '@/lib/utils';

interface NoteForArtProps {
    note: Note;
    reloadNotes: (arg: any) => any;
}

export const NoteForArt = ({note, reloadNotes}: NoteForArtProps) => {
    // const [currentColor, setCurrentColor] = useState<Color>(note.color);
    const {sellerId} = useCampaign();
    const [text, setText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        if (isPopoverOpen) {
            getNoteInfo();
        }
    }, [isPopoverOpen]);

    const getNoteInfo = async () => {
        try {
            setIsLoading(true);
            const params = {id: note.id, seller_id: sellerId};
            const res = await ApiClient.post('massAdvert/notes/getFullNote', params);
            console.log(res);
            if (!res || !res.data || !res.data) {
                throw new Error(`Error while getting full note for ${note.id}`);
            }
            setText(res.data.text);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <EditNoteForArt
                open={openModal}
                setOpen={setOpenModal}
                id={note.id}
                nmId={note.nmId}
                reloadNotes={reloadNotes}
            />
            <Popover
                open={isPopoverOpen}
                enableSafePolygon={true}
                placement={'right'}
                // onOpenChange={(open) => {
                //     if (open) {
                //         getNoteInfo();
                //     }
                // }}
                content={
                    <Card
                        className={cx(['blurred-card', 'centred-absolute-element'])}
                        style={
                            {
                                padding: 8,
                                width: '200px',
                                height: 96,
                                '--g-card-border-color': colors[note.color],
                            } as CSSProperties
                        }
                    >
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div>
                                <div>
                                    <Text>
                                        {new Date(note?.time || new Date()).toLocaleDateString(
                                            'ru-RU',
                                        )}
                                    </Text>
                                </div>
                                <div>
                                    <Text>{text}</Text>
                                </div>
                            </div>
                        )}
                    </Card>
                }
            >
                <div
                    onMouseEnter={() => setIsPopoverOpen(true)}
                    onMouseLeave={() => setIsPopoverOpen(false)}
                >
                    <Button
                        onClick={() => {
                            setOpenModal(true);
                        }}
                        style={{width: 32, maxHeight: 12, backgroundColor: colors[note.color]}}
                    />
                </div>
                {/* <SetColorButton color={currentColor}></SetColorButton> */}
            </Popover>
        </div>
    );
};
