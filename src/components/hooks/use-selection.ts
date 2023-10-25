import { useCallback, useEffect, useState } from 'react';

type Item = any; // Replace 'any' with the actual type of your items

interface Selection {
    handleDeselectAll: () => void;
    handleDeselectOne: (item: Item) => void;
    handleSelectAll: (itemIds: string[]) => void; // Update this line
    handleSelectOne: (item: Item) => void;
    selected: Item[];
}

export const useSelection = (items: any[] = []): Selection => {
    const [selected, setSelected] = useState<Item[]>([]);

    useEffect(() => {
        setSelected([]);
    }, [items]);

    const handleSelectAll = useCallback(() => {
        setSelected([...items]);
    }, [items]);

    const handleSelectOne = useCallback((item: any) => {
        setSelected((prevState) => [...prevState, item]);
    }, []);

    const handleDeselectAll = useCallback(() => {
        setSelected([]);
    }, []);

    const handleDeselectOne = useCallback((item: any) => {
        setSelected((prevState) => {
            return prevState.filter((_item) => _item !== item);
        });
    }, []);

    return {
        handleDeselectAll,
        handleDeselectOne,
        handleSelectAll,
        handleSelectOne,
        selected,
    };
};
