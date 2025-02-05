// contexts/ModuleProvider.tsx
'use client';

import {createContext, useContext, useState, useEffect, useCallback, useMemo} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {useCampaign} from '@/contexts/CampaignContext';

type ModuleContextType = {
    currentModule: string;
    availableModules: string[];
    setModule: (module: string) => void;
    modulesLoaded: boolean;
    modulesMap: any;
};

const ModuleContext = createContext<ModuleContextType>({
    currentModule: '',
    availableModules: [],
    setModule: () => {},
    modulesLoaded: false,
    modulesMap: {},
});

export const ModuleProvider = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {modules = [], campaignInfo = {}, campaignLoaded} = useCampaign(); // Add default value
    // const {modulesMap = {}} = campaignInfo?.modules || {};
    const modulesMap = useMemo(() => {
        return campaignInfo?.modules || {};
    }, [campaignInfo]);

    const [availableModules, setAvailableModules] = useState<string[]>([]);
    const [availableModulesMap, setAvailableModulesMap] = useState({});
    const [currentModule, setCurrentModule] = useState('');
    const [modulesLoaded, setModulesLoaded] = useState(false);

    useEffect(() => {
        if (!modules || !campaignLoaded) return;
        // Ensure modules is always an array
        const safeModules = Array.isArray(modules) ? modules : [];
        console.log(safeModules, modules, 'modules');
        console.log(safeModules, 'MODULES FROM USE CAMPAIGN');

        const baseModules = safeModules.includes('all')
            ? [
                  'massAdvert',
                  'analytics',
                  'prices',
                  'delivery',
                  'nomenclatures',
                  'buyers',
                  'reports',
                  'seo',
              ]
            : safeModules;
        console.log(baseModules);
        setAvailableModules([...baseModules, 'api']);
        const baseModulesMap = safeModules.includes('all')
            ? {
                  massAdvert: 'Управление',
                  analytics: 'Управление',
                  prices: 'Управление',
                  delivery: 'Управление',
                  nomenclatures: 'Управление',
                  buyers: 'Управление',
                  reports: 'Управление',
                  seo: 'Управление',
              }
            : modulesMap;
        setAvailableModulesMap(baseModulesMap);
        setModulesLoaded(true);
    }, [modules, campaignLoaded]);

    useEffect(() => {
        console.log(campaignLoaded);
        if (!campaignLoaded) return;
        const pathModule = pathname.split('/').pop() || '';
        console.log(availableModules, 'availableModules');

        if (availableModules.includes(pathModule)) {
            setCurrentModule(pathModule);
        } else if (availableModules.length > 0) {
            const defaultModule = availableModules.includes('massAdvert')
                ? 'massAdvert'
                : availableModules[0];

            router.push(`/${defaultModule}?${searchParams.toString()}`);
        }
    }, [pathname, availableModules, searchParams, campaignLoaded]);

    const handleSetModule = useCallback(() => {}, [router, pathname, searchParams]);

    return (
        <ModuleContext.Provider
            value={{
                currentModule,
                availableModules: availableModules || [], // Ensure array
                setModule: handleSetModule,
                modulesLoaded: modulesLoaded,
                modulesMap: availableModulesMap,
            }}
        >
            {children}
        </ModuleContext.Provider>
    );
};

export const useModules = () => useContext(ModuleContext);
