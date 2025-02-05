'use client';
import {Button, Icon, Select, Tabs, TabsItemProps, Text, useTheme} from '@gravity-ui/uikit';
import Link from 'next/link';
import {ChevronDown} from '@gravity-ui/icons';
import {useUser} from '../RequireAuth/RequireAuth';
import {CSSProperties, ReactElement, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
// import {useRouter} from 'next/router';

interface CustomTabsProps {
    items: TabsItemProps[] | undefined;
    activeTab: string | undefined;
    onSelectTab: (tabId: string) => void;
}

export const CustomTabs = ({items, activeTab, onSelectTab}: CustomTabsProps) => {
    const theme = useTheme();
    // const router = useRouter();
    const router = useRouter();
    const {refetchUser} = useUser();
    const tabsRef = useRef<HTMLDivElement | null>(null);
    const [visibleTabs, setVisibleTabs] = useState<ReactElement[]>([]);
    const [hiddenTabs, setHiddenTabs] = useState<TabsItemProps[]>([]);
    const [_selectValueFromTab, setSelectValueFromTab] = useState([''] as string[]);
    const [selectObjectFromTab, setSelectObjectFromTab] = useState({} as any);

    useEffect(() => {
        if (!tabsRef.current || !items) return;

        const resizeObserver = new ResizeObserver(() => updateVisibleTabs());
        resizeObserver.observe(tabsRef.current);

        return () => resizeObserver.disconnect();
    }, [items]);

    const updateVisibleTabs = () => {
        if (!tabsRef.current || !items) return;

        const containerWidth = tabsRef.current.offsetWidth - 102; // Adjust padding/margins
        let currentWidth = 0;
        const newVisibleTabs: ReactElement[] = [];
        const newHiddenTabs: TabsItemProps[] = [];
        let flag = false;

        items.forEach((item: any, index) => {
            // Measure tab width
            const tempElement = document.createElement('text');
            tempElement.style.position = 'absolute';
            tempElement.style.visibility = 'hidden';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.style.fontSize = 'var(--g-text-body-3-font-size)';
            // tempElement.style.fontSize = 'var(--g-text-body-3-font-size)';
            tempElement.innerText = item.title as string;
            document.body.appendChild(tempElement);

            const itemWidth = tempElement.offsetWidth + 24; // Account for padding/margins
            console.log(itemWidth, containerWidth);
            document.body.removeChild(tempElement);

            if (currentWidth + itemWidth < containerWidth && !flag) {
                newVisibleTabs.push(
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: 60,
                            // top: item.id === activeTab ? '-5px' : undefined,
                            borderBottom:
                                item.id === activeTab ? '5px solid #ffbe5c' : '5px solid #0000',
                        }}
                    >
                        <Link
                            href={item.href}
                            className="tablink"
                            style={{color: 'var(--g-color-text-primary)', textDecoration: 'none'}}
                            onClick={() => {
                                if (item.disabled || !item.id) return;
                                refetchUser();
                                onSelectTab(item.href);
                            }}
                        >
                            <Text variant="body-3" color={item.disabled ? 'secondary' : undefined}>
                                {item.title}
                            </Text>
                        </Link>
                    </div>,
                );
                currentWidth += itemWidth;
            } else {
                newHiddenTabs.push(item);
                flag = true;
                return undefined;
            }
        });

        setVisibleTabs(newVisibleTabs);
        setHiddenTabs(newHiddenTabs);
    };

    const notShowingOptions = useMemo(() => {
        return hiddenTabs.map((tab) => {
            return {content: tab.title, value: tab.id};
        });
    }, [hiddenTabs]);

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // Align items in a single row
                width: '100%', // Ensure it stretches across the container
                boxShadow: `inset 0px -9px 0px -8px ${theme === 'dark' ? '#2d2c33' : '#fff'}`,
            }}
        >
            {/* Tabs Container */}
            <div
                ref={tabsRef}
                style={{
                    display: 'flex',
                    flexGrow: 1, // Allow tabs to take up available space
                    overflow: 'hidden', // Prevent tabs from overflowing
                }}
            >
                <Tabs
                    key={'CommonTab'}
                    className="tabs"
                    activeTab={activeTab}
                    onSelectTab={onSelectTab}
                    items={items}
                >
                    {visibleTabs}
                </Tabs>
                {notShowingOptions.length !== 0 && (
                    <Select
                        // open={true}
                        options={notShowingOptions}
                        onUpdate={(value) => {
                            setSelectValueFromTab(value);
                            const currentItem: any = items?.filter(
                                (item) => item.id == value[0],
                            )[0];
                            router.replace(currentItem.href); // Navigate programmatically
                            setSelectObjectFromTab(currentItem);
                            // onSelectTab(currentItem?.id as string);
                        }}
                        renderOption={(option) => {
                            const currentItem: any = items?.filter(
                                (item) => item.id == option.value,
                            )[0];
                            return (
                                <Text
                                    variant="body-3"
                                    color={currentItem.disabled ? 'secondary' : undefined}
                                >
                                    {currentItem.title}
                                </Text>
                            );
                        }}
                        renderControl={({onClick, onKeyDown, ref}) => (
                            <Button
                                view={'flat'}
                                pin="brick-brick"
                                style={
                                    {
                                        '--yc-button-background-color-hover': 'none',
                                        height: 66,
                                        width: 96,
                                        marginInline: '8px',
                                        textOverflow: 'ellipsis',
                                        background: 'transparent',
                                        borderBottom: notShowingOptions.some(
                                            (opt) => opt.value === activeTab,
                                        )
                                            ? '5px solid #ffbe5c'
                                            : '5px solid #00000000',
                                        scrollbarColor:
                                            'var(--g-color-scroll-handle) var(--g-color-scroll-track)',
                                        scrollbarWidth: 'auto',
                                        flexShrink: 0,
                                        alignItems: 'center',
                                    } as CSSProperties
                                }
                                ref={ref}
                                onClick={onClick}
                                extraProps={{onKeyDown}}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: '4px',
                                    }}
                                >
                                    <Text variant="body-3" style={{marginRight: '4px'}}>
                                        {selectObjectFromTab.title ||
                                            `Еще · ${notShowingOptions.length}`}
                                    </Text>
                                    {notShowingOptions.length > 1 && <Icon data={ChevronDown} />}
                                </div>
                            </Button>
                        )}
                    />
                    // <div style={{marginLeft: 'auto', flexShrink: 0}}>
                    // </div>
                )}
            </div>

            {/* Dropdown (Extra Tabs) */}
        </div>
    );
};
