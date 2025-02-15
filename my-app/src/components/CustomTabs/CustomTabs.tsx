'use client';
import {
    Icon,
    Select,
    SelectOption,
    Tab,
    TabProvider,
    // TabPanel,
    Text,
    useTheme,
} from '@gravity-ui/uikit';
import {ChevronDown} from '@gravity-ui/icons';
import {CSSProperties, ReactElement, Ref, useEffect, useMemo, useRef, useState} from 'react';
import {useModules} from '@/contexts/ModuleProvider';

// import {useRouter} from 'next/router';

interface TabsItemProps {
    value?: string;
    title: string;
    href: string;
    id?: string;
}

interface CustomTabsProps {
    items: TabsItemProps[] | undefined;
    activeTab: string | null;
}

export const CustomTabs = ({items}: CustomTabsProps) => {
    const theme = useTheme();
    // const router = useRouter();
    // const {refetchUser} = useUser();
    const tabsRef = useRef<HTMLDivElement | null>(null);
    const [visibleTabs, setVisibleTabs] = useState<ReactElement[]>([]);
    const [hiddenTabs, setHiddenTabs] = useState<TabsItemProps[]>([]);
    // const [selectValueFromTab, setSelectValueFromTab] = useState([''] as string[]);
    const [selectObjectFromTab, _setSelectObjectFromTab] = useState({} as any);
    const {setModule, currentModule} = useModules();
    // const [valueOfTab, setValueOfTab] = useState<string>(currentModule as string);
    const [valueOfTab, setValueOfTab] = useState<string | null>(null);
    useEffect(() => {
        if (currentModule) {
            setValueOfTab(currentModule);
        }
    }, [currentModule]);

    useEffect(() => {
        if (!tabsRef.current || !items) return;

        const resizeObserver = new ResizeObserver(() => {
            updateVisibleTabs();
        });

        resizeObserver.observe(tabsRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [items?.length, currentModule, valueOfTab]); // ✅ Now runs only when `items.length` changes

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
            document.body.removeChild(tempElement);

            if (currentWidth + itemWidth < containerWidth && !flag) {
                console.log(item.id, valueOfTab);
                newVisibleTabs.push(
                    <Tab key={index} value={item.id} title={item.title} disabled={item.disabled}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                height: 60,
                                // top: item.id === activeTab ? '-5px' : undefined,
                                borderBottom:
                                    item.id === valueOfTab ? '5px solid #ffbe5c' : undefined,
                            }}
                        >
                            <Text variant="body-3" color={item.disabled ? 'secondary' : 'primary'}>
                                {item.title}
                            </Text>
                        </div>
                    </Tab>,
                );
                currentWidth += itemWidth;
            } else {
                newHiddenTabs.push(item);
                flag = true;
                return undefined;
            }
        });

        setVisibleTabs((prev) => (prev === newVisibleTabs ? prev : newVisibleTabs));
        setHiddenTabs((prev) => (prev === newHiddenTabs ? prev : newHiddenTabs));
    };

    const notShowingOptions = useMemo(() => {
        if (hiddenTabs.length === 0) return [];
        return hiddenTabs.map(
            (tab) => ({text: tab.title, data: tab.id as string}) as SelectOption<string>,
        );
    }, [hiddenTabs]); // ✅ Memoized with stable reference'

    const handleUpdateTabs = (value: string) => {
        console.log(value);
        setValueOfTab(value);
        if (value === 'more') {
        } else {
            setModule(value);
        }
    };

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
                style={
                    {
                        display: 'flex',
                        flexGrow: 1, // Allow tabs to take up available space
                        overflow: 'hidden',
                        gap: '16px', // Prevent tabs from overflowing
                    } as CSSProperties
                }
            >
                <TabProvider
                    value={valueOfTab ? valueOfTab : ''}
                    key={'CommonTab'}
                    onUpdate={(value: string) => {
                        handleUpdateTabs(value);
                    }}
                >
                    {visibleTabs}
                    {notShowingOptions.length !== 0 && (
                        <Tab value="more">
                            <div>
                                <Select
                                    // open={true}
                                    options={notShowingOptions}
                                    // onUpdate={() => {
                                    //     // setSelectValueFromTab(value);
                                    //     // const currentItem: any = items?.filter(
                                    //     //     (item) => item.id == value[0],
                                    //     // )[0];
                                    //     // console.log(selectOption);
                                    //     // router.replace(currentItem.href); // Navigate programmatically
                                    //     // setSelectObjectFromTab(currentItem);
                                    //     // setModule(currentItem);
                                    //     // onSelectTab(currentItem?.id as string);
                                    // }}
                                    renderOption={(option) => {
                                        const currentItem: any = items?.filter(
                                            (item) => item.id == option.data,
                                        )[0];
                                        return (
                                            <Text
                                                onClick={() => {
                                                    setModule(currentItem?.id);
                                                    setValueOfTab('more');
                                                }}
                                                variant="body-3"
                                                color={
                                                    currentItem?.disabled ? 'secondary' : undefined
                                                }
                                            >
                                                {currentItem?.title}
                                            </Text>
                                        );
                                    }}
                                    renderControl={({triggerProps: {onClick, onKeyDown}, ref}) => (
                                        <div
                                            // view={'flat'}
                                            // pin="brick-brick"
                                            style={
                                                {
                                                    '--gc-button-background-color-hover': 'none',
                                                    height: 60,
                                                    width: 96,
                                                    marginInline: '8px',
                                                    textOverflow: 'ellipsis',
                                                    background: 'transparent',
                                                    borderBottom:
                                                        'more' === valueOfTab
                                                            ? '5px solid #ffbe5c'
                                                            : undefined,
                                                    // borderBottom: notShowingOptions.some(
                                                    //     (opt) => opt.value === activeTab,
                                                    // )
                                                    //     ? '5px solid #ffbe5c'
                                                    //     : '5px solid #00000000',
                                                    scrollbarColor:
                                                        'var(--g-color-scroll-handle) var(--g-color-scroll-track)',
                                                    scrollbarWidth: 'auto',
                                                    flexShrink: 0,
                                                    alignContent: 'center',
                                                    justifyItems: 'center',
                                                } as CSSProperties
                                            }
                                            ref={ref as Ref<HTMLDivElement>}
                                            onClick={onClick}
                                            onKeyDown={onKeyDown}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    // marginTop: 'px',
                                                }}
                                            >
                                                <Text variant="body-3" style={{marginRight: '4px'}}>
                                                    {selectObjectFromTab.title ||
                                                        `Еще · ${notShowingOptions.length}`}
                                                </Text>
                                                {notShowingOptions.length > 1 && (
                                                    <Icon data={ChevronDown} />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </Tab>
                    )}
                </TabProvider>
                {/* <Tabs
                    key={'CommonTab'}
                    className="tabs"
                    activeTab={activeTab}
                    onSelectTab={onSelectTab}
                    items={items}
                >
                    {visibleTabs}
                </Tabs> */}
                {/* {notShowingOptions.length !== 0 && (
                    <Select
                        // open={true}
                        options={notShowingOptions}
                        onUpdate={(value) => {
                            setSelectValueFromTab(value);
                            const currentItem: any = items?.filter(
                                (item) => item.id == value[0],
                            )[0];
                            setModule(currentItem);
                            // router.replace(currentItem.href); // Navigate programmatically
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
                        renderControl={({triggerProps: {onClick, onKeyDown}, ref}) => (
                            <Button
                                view={'flat'}
                                pin="brick-brick"
                                style={
                                    {
                                        '--gc-button-background-color-hover': 'none',
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
                                // ref={ref as Ref<HTMLButtonElement>}
                                onClick={onClick}
                                // onKeyDown={onKeyDown}
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
                )} */}
            </div>

            {/* Dropdown (Extra Tabs) */}
        </div>
    );
};
