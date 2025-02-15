'use client';
import './Dashboard.scss';
import {useEffect, useMemo, useState, ReactNode} from 'react';
import block from 'bem-cn-lite';
import {Icon, Button, Tooltip} from '@gravity-ui/uikit';
// import Link from 'next/link';
// import '@/styles/App.scss'
import textLogo from '@/assets/textLogo.png';
import {CircleQuestion, LogoTelegram, GraduationCap} from '@gravity-ui/icons';

// import {useUser} from '@/components/RequireAuth/RequireAuth';
// import {ApiPage} from './ApiPage';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {UserPopup} from '@/components/UserPopup';
import {useCampaign} from '@/contexts/CampaignContext';
import {SelectCampaign} from '@/components/SelectCampaign';
import {useSearchParams} from 'next/navigation';
import {useModules} from '@/contexts/ModuleProvider';
import {CustomTabs} from '../CustomTabs';
// import {NotesCreationModal} from '@/components/Notes';
// import {AdvertsWordsModal} from '../Pages/MassAdvertPage/AdvertsWordsModal';
import {AdvertsWordsModal2} from '../Pages/MassAdvertPage/AdvertsWordsModal2';
import {NotesCreationModal} from '../Notes';

const b = block('app');

export interface User {
    uuid: string;
    roles: string[];
    modules: string[];
    campaignNames: string[];
    subscription: boolean;
}

export interface DashboardProps {
    toggleTheme: (val: string) => void;
    theme: string;
    children: ReactNode;
}

export const Dashboard = ({toggleTheme, theme, children}: DashboardProps) => {
    const searchParams = useSearchParams();
    // const {refetchUser} = useUser();
    const {selectValue, currentCampaign, campaignInfo, campaigns, sellerId} = useCampaign();
    const {currentModule, availableModules = []} = useModules();

    const moduleTitles: Record<string, string> = {
        massAdvert: 'Реклама',
        analytics: 'Аналитика',
        prices: 'Цены',
        delivery: 'Поставки',
        nomenclatures: 'Товары',
        buyers: 'Покупатели',
        reports: 'Отчеты',
        seo: 'SEO',
        api: 'Магазины',
    };
    const optionsPages = useMemo(() => {
        if (!availableModules) return [];
        return availableModules.map((module) => ({
            id: module,
            title: moduleTitles[module],
            href: `/${module}?${searchParams.toString()}`,
        }));
    }, [availableModules, searchParams]);

    // const handleModuleChange = (moduleId: string) => {
    //     console.log(optionsPages);
    //     console.log(searchParams.toString());
    //     setModule(moduleId);
    // };

    useEffect(() => {
        console.log(JSON.stringify(currentCampaign), 'currentCampaign');
        const titleMap: Record<string, string> = {
            massAdvert: 'Реклама',
            analytics: 'Аналитика',
            prices: 'Цены',
            delivery: 'Поставки',
            nomenclatures: 'Товары',
            buyers: 'Покупатели',
            reports: 'Отчеты',
            seo: 'SEO',
            api: 'Магазины',
        };

        document.title = currentModule ? `${titleMap[currentModule]} | AURUM` : 'AURUM | Магазины';
    }, [currentModule]);
    // useEffect(() => {
    //     localStorage.setItem('theme', JSON.stringify(theme));
    //     setThemeAurum(theme);
    // }, [theme]);

    // const [refetchAutoSales, setRefetchAutoSales] = useState(false);
    // const [dzhemRefetch, setDzhemRefetch] = useState(false);
    // Add null check before accessing campaigns
    // const {campaigns = []} = userInfo ?? {}; // Default to empty array

    // Update selectOptions memo
    const selectOptions = useMemo(() => {
        if (!campaigns) return [];
        return campaigns.map((campaign: any) => ({
            value: campaign.seller_id,
            content: campaign.name,
        }));
    }, [campaigns]);

    // const {availableTags, availableTagsPending} = useCampaign();
    //
    // const [tagsAddedForCurrentNote, setTagsAddedForCurrentNote] = useState([] as any[]);
    // const [notesModalOpen, setNotesModalOpen] = useState(false);
    // const [currentNote, setCurrentNote] = useState('');
    // const [page, setPage] = useState('analytics');
    // const [page, setPage] = useState('delivery');

    const [subscriptionExpDate, setSubscriptionExpDate] = useState(undefined as any);
    const [apiKeyExpDate, setApiKeyExpDate] = useState(undefined as any);

    // Replace the modules memo with useEffect
    useEffect(() => {
        if (!campaigns?.length || !selectValue[0]) return;

        // const selectedCampaign = campaigns.find(
        //     (campaign: any) => campaign.name === selectValue[0],
        // );

        if (campaignInfo) {
            setSubscriptionExpDate(campaignInfo.subscriptionUntil);
            setApiKeyExpDate(campaignInfo.apiKeyExpDate);
            // setModulesMap(selectedCampaign.userModules || {});
        }
    }, [campaigns, selectValue]); // Only update when these values change

    // const renderFooterItem = (item: any, node: any, index: any) => {
    //     if (item === undefined || node === undefined || index === undefined) return <></>;
    //     const isCurrent =
    //         (currentModule == 'noModules' && item.id == 'api') || item.id == currentModule;
    //     return (
    //         <Link
    //             href={item?.href}
    //             target={item?.target}
    //             className="tablink"
    //             style={{color: 'var(--g-color-text-primary)', textDecoration: 'none'}}
    //             onClick={() => {
    //                 if (item.disabled || !item.id) return;
    //                 refetchUser();
    //                 console.log(item.id);
    //                 handleModuleChange(item.id);
    //                 // setPage(item.id);
    //             }}
    //         >
    //             <Text
    //                 variant="caption-2"
    //                 color={isCurrent ? 'brand' : 'primary'}
    //                 style={{
    //                     height: 70,
    //                     paddingBottom: 10,
    //                     width: 70,
    //                     display: 'flex',
    //                     flexDirection: 'column',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                 }}
    //             >
    //                 <Icon data={item?.icon} size={24} />
    //                 {item.title}
    //             </Text>
    //         </Link>
    //     );
    // };

    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!campaigns.length) {
        return <div></div>;
    }

    return (
        <div className={b()}>
            {isMobile ? (
                <div
                    style={{
                        position: 'fixed',
                        bottom: -1,
                        zIndex: 10,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {/* <Tabs
                        onSelectTab={handleModuleChange}
                        key={'mobileTab'}
                        wrapTo={renderFooterItem}
                        activeTab={currentModule}
                        items={optionsPages.filter((item) =>
                            ['Реклама', 'Магазины', 'Поддержка', 'База знаний'].includes(
                                item.title,
                            ),
                        )}
                    /> */}
                </div>
            ) : (
                <></>
            )}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    height: 68,
                    zIndex: 1000,
                    backdropFilter: 'blur(20px)',
                }}
            >
                {isMobile ? (
                    <div
                        style={{
                            width: '100%',
                            boxShadow: 'inset 0px -9px 0px -8px var(--g-color-base-generic-hover)',
                            background: '#0000',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                position: 'fixed',
                                top: 0,
                                height: 68,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    height: 68,
                                }}
                            >
                                <div style={{minWidth: 24}} />
                                <img
                                    style={{height: 'calc(100% - 24px)'}}
                                    src={textLogo.src}
                                    alt="Aurum logo"
                                />
                            </div>
                            <SelectCampaign
                                apiKeyExpDate={apiKeyExpDate}
                                subscriptionExpDate={subscriptionExpDate}
                                selectOptions={selectOptions}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-around',
                            position: 'absolute',
                            top: 0,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                // boxShadow: 'var(--g-color-base-background) 0px 1px 8px',
                                // background: '#00000022',
                                background: '#0000',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    boxShadow:
                                        'inset 0px -9px 0px -8px var(--g-color-base-generic-hover)',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0px 40px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            overflow: 'hidden',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flex: 1,
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: 68,
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                boxShadow:
                                                    '1px 0px 0px 0px var(--g-color-base-generic-hover)',
                                            }}
                                        >
                                            <div style={{minWidth: 12}} />
                                            <img
                                                style={{height: 'calc(100% - 24px)'}}
                                                src={textLogo.src}
                                                alt="Aurum logo"
                                            />
                                            <div style={{minWidth: 32}} />
                                        </div>
                                        <div style={{minWidth: 32}} />
                                        <CustomTabs
                                            items={optionsPages.filter(
                                                (item) =>
                                                    !['Поддержка', 'База знаний'].includes(
                                                        item.title,
                                                    ),
                                            )}
                                            activeTab={currentModule}
                                            // onSelectTab={handleModuleChange}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            height: 68,
                                            display: 'flex',
                                            flexShrink: 0,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div style={{minWidth: 12}} />
                                                <Tooltip content={'База знаний'}>
                                                    <Button
                                                        size="xl"
                                                        href={'https://aurum-wiki.tilda.ws/tdocs/'}
                                                        target={'_blank'}
                                                    >
                                                        <Icon data={GraduationCap} size={18} />
                                                    </Button>
                                                </Tooltip>
                                                <div style={{minWidth: 12}} />
                                                <Tooltip content={'Поддержка'}>
                                                    <Button
                                                        size="xl"
                                                        href={'https://t.me/AurumSkyNetSupportBot'}
                                                        target={'_blank'}
                                                    >
                                                        <Icon data={CircleQuestion} size={18} />
                                                    </Button>
                                                </Tooltip>
                                                <div style={{minWidth: 12}} />
                                                <Tooltip content={'Наш телеграм канал'}>
                                                    <Button
                                                        size="xl"
                                                        href={'https://t.me/+5PHQ7OK2pT4yMDBi'}
                                                        target={'_blank'}
                                                    >
                                                        <Icon data={LogoTelegram} size={18} />
                                                    </Button>
                                                </Tooltip>
                                                <div style={{minWidth: 24}} />
                                            </div>
                                            {selectValue[0] ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        height: 68,
                                                        boxShadow:
                                                            '-1px 0px 0px 0px var(--g-color-base-generic-hover)',
                                                    }}
                                                >
                                                    <div style={{minWidth: 12}} />
                                                    <div style={{minWidth: 8}} />
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        {/* <AdvertsWordsModal2 /> */}
                                        <NotesCreationModal sellerId={sellerId} />
                                        <UserPopup toggleTheme={toggleTheme} theme={theme} />
                                        <div
                                            style={{
                                                height: 68,
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                boxShadow:
                                                    '-1px 0px 0px 0px var(--g-color-base-generic-hover)',
                                            }}
                                        >
                                            <SelectCampaign
                                                apiKeyExpDate={apiKeyExpDate}
                                                subscriptionExpDate={subscriptionExpDate}
                                                selectOptions={selectOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div
                style={{
                    marginTop: 62,
                    justifyContent: 'center',
                    width: 'calc(100vw - 80px)',
                    position: 'relative',
                    height: '100vh',
                }}
            >
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        // background:
                        // 'linear-gradient(180deg, rgba(45, 44, 51, 1) 0%, rgba(34, 33, 39, 1) 100%)',
                    }}
                >
                    {children}
                    {/* {currentTime >= new Date(subscriptionExpDate) &&
                    ![1122958293, 933839157].includes(userInfo?.user?._id) &&
                    !['noModules', 'api'].includes(page) ? (
                        <NoSubscriptionPage />
                    ) : (
                        <PageElem
                            permission={modules.includes('all') ? 'Управление' : modulesMap?.[page]}
                            page={page}
                            refetchAutoSales={refetchAutoSales}
                            setRefetchAutoSales={setRefetchAutoSales}
                            dzhemRefetch={dzhemRefetch}
                            setDzhemRefetch={setDzhemRefetch}
                            sellerId={sellerId}
                        />
                    )} */}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        // background: 'var(--g-color-base-background)',
                        width: '100vw',
                        bottom: -100,
                        left: -40,
                        height: 100,
                    }}
                ></div>
            </div>
        </div>
    );
};

// const PageElem = ({
//     page,
//     permission,
//     refetchAutoSales,
//     setRefetchAutoSales,
//     dzhemRefetch,
//     setDzhemRefetch,
//     sellerId,
// }) => {
//     const pages = {
//         delivery: <DeliveryPage permission={permission} sellerId={sellerId} />,
//         massAdvert: (
//             <MassAdvertPage
//                 permission={permission}
//                 refetchAutoSales={refetchAutoSales}
//                 setRefetchAutoSales={setRefetchAutoSales}
//                 dzhemRefetch={dzhemRefetch}
//                 setDzhemRefetch={setDzhemRefetch}
//                 sellerId={sellerId}
//             />
//         ),
//         prices: <PricesPage permission={permission} sellerId={sellerId} />,
//         nomenclatures: <NomenclaturesPage permission={permission} sellerId={sellerId} />,
//         analytics: <AnalyticsPage permission={permission} sellerId={sellerId} />,
//         buyers: <BuyersPage permission={permission} sellerId={sellerId} />,
//         reports: <DetailedReportsPage sellerId={sellerId} />,
//         seo: <SEOPage />,
//         api: <ApiPage />,
//         noModules: <ApiPage />,
//     };
//     return pages[page] ?? <></>;
// };
