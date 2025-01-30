'use client';
import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {useError} from './ErrorContext';
import callApi, {getUid} from '../utilities/callApi';
import {useRouter, useSearchParams} from 'next/navigation';
import {useUser} from '@/components/RequireAuth/RequireAuth';

// Create the context
const CampaignContext = createContext(null as any);

export const useCampaign = () => {
    return useContext(CampaignContext);
};

// CampaignProvider component that wraps the app
export const CampaignProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    // In CampaignProvider.tsx
    const router = useRouter();
    const {showError} = useError();
    const searchParams = useSearchParams();
    const {userInfo} = useUser();
    const {campaigns} = userInfo ?? [];
    const findCampaign = useCallback(
        (seller_id: string) => {
            return campaigns?.find((c: any) => c.seller_id === seller_id) || {};
        },
        [campaigns],
    );

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );
    // console.log(campaigns);
    const [selectValue, setSelectValue] = useState([''] as string[]); // Current selected campaign
    const [campaignInfo, setCampaignInfo] = useState([{}] as any[]);
    // CampaignProvider.tsx
    const [sellerId, setSellerId] = useState(() => {
        const initialSellerId = searchParams.get('seller_id') || campaigns?.[0]?.seller_id;
        return initialSellerId ?? '';
    });
    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = useState(false); // Flag for switching
    const [availableTags, setAvailableTags] = useState([] as string[]); // Tags related to the selected campaign
    const [availableTagsPending, setAvailableTagsPending] = useState(false); // Loading state for tags
    // CampaignProvider.tsx

    useEffect(() => {
        const seller_id = searchParams.get('seller_id');
        console.log(seller_id);
        const firstCampaignId = campaigns?.[0]?.seller_id;

        console.log(campaigns);

        if (!campaigns?.length) return;

        // Prevent redundant updates with stable reference
        const currentParams = searchParams.toString();

        if (!seller_id && firstCampaignId) {
            const newParams = new URLSearchParams(currentParams);
            newParams.set('seller_id', firstCampaignId);

            // Only update if params actually changed
            if (newParams.toString() !== currentParams) {
                window.history.replaceState(null, '', `?${newParams.toString()}`);
                // router.replace(`?${newParams.toString()}`);
            }

            // Directly set state without waiting for URL change
            const campaign = findCampaign(firstCampaignId);
            setSellerId(firstCampaignId);
            setSelectValue([campaign?.name || '']);
            return;
        }
        console.log(seller_id, sellerId);

        if (seller_id && seller_id !== sellerId) {
            console.log(seller_id);
            const campaign = findCampaign(seller_id)
            if (campaign) {
                // Batch state updates
                setSellerId(seller_id);
                setSelectValue([campaign.name]);
                setCampaignInfo(campaign);
                setSwitchingCampaignsFlag(false)
            }
        }
    }, [searchParams, campaigns, sellerId, router]); // Add sellerId to deps

    useEffect(() => {
        if (!selectValue[0]) return;
        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'No response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
            })
            .catch((error) => {
                showError(
                    'Ошибка получения тегов: ' +
                        (error.response?.data?.error || 'неизвестная ошибка'),
                );
            })
            .finally(() => {
                setAvailableTagsPending(false);
            });
    }, [selectValue]);

    return (
        <CampaignContext.Provider
            value={{
                selectValue,
                setSelectValue,
                campaignInfo,
                setCampaignInfo,
                sellerId,
                setSellerId,
                switchingCampaignsFlag,
                setSwitchingCampaignsFlag,
                availableTags,
                availableTagsPending,
            }}
        >
            {children}
        </CampaignContext.Provider>
    );
};
