import {
    Box,
    Button,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import type { FC, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Scrollbar } from '../common/ScrollBar/Scrollbar';
import axios from 'axios';

interface ListDataTableProps {
    selectedDuLieuThuThap: any | null;
    onSelectDuLieuThuThap: (value: any | null) => void;
}

export const ListDataTable: FC<ListDataTableProps> = (props) => {
    const { selectedDuLieuThuThap, onSelectDuLieuThuThap, ...other } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedData, setSelectedData] = useState<null | any>(null);
    const [datas, setDatas] = useState([]);

    const [searchValue, setSearchValue] = useState({
        search: '',
    });
    const [draftValue, setDraftValue] = useState({
        search: '',
    });

    const accessToken = localStorage.getItem('access_token');

    const clearQuery = () => {
        setDraftValue({
            search: '',
        });
    };

    const onSearch = async () => {
        console.log(draftValue);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/category/filter`,
                {
                    name: draftValue.search || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setDatas(response.data);
        } catch (error) {
            console.error('Error searching Users:', error);
        }
    };

    const onChange = (value: string, name: string): void => {
        setDraftValue({
            ...draftValue,
            [name]: value,
        });
    };

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/category`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setDatas(response.data);
            } catch (error) {
                console.error('Error fetching Users:', error);
                setDatas([]);
            }
        };
        fetchDatas();
    }, [accessToken]);

    return (
        <div {...other}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexWrap: 'wrap',
                    m: -1.5,
                    px: 3,
                    py: 2,
                }}
            >
                <TextField
                    size="small"
                    label="Từ khóa"
                    placeholder="Nhập từ khóa"
                    sx={{ mr: 2, mt: 2 }}
                    value={draftValue.search}
                    onChange={(event) => onChange(event.target.value, 'search')}
                />

                <Button
                    variant="contained"
                    onClick={onSearch}
                    sx={{
                        mt: 2,
                        mr: 2,
                    }}
                >
                    Search
                </Button>
                <Button
                    size="medium"
                    color="error"
                    sx={{ mr: 2, mt: 2 }}
                    variant="outlined"
                    onClick={clearQuery}
                >
                    Reset Filter
                </Button>
            </Box>
            <Typography
                color="gray"
                sx={{
                    lineHeight: '24px',
                    px: 3,
                    py: 0.5,
                    mt: 4.5,
                }}
            >
                Categories List
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.app',
                    position: 'relative',
                    overflow: 'auto',
                    border: '1px solid #ececec',
                    borderRadius: '3px',
                    maxHeight: '100%',
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                <li key={`section-category`}>
                    <ul>
                        {datas.length > 0 &&
                            datas.map((item: any) => (
                                <ListItem
                                    key={`item-${item.id}`}
                                    sx={{
                                        fontSize: '15px',
                                        pl: { xs: 3, sm: 6 },
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'primary.dark'
                                                    : '',
                                        },
                                        backgroundColor: `${
                                            selectedDuLieuThuThap?.id ===
                                            item.id
                                                ? 'primary.light'
                                                : ''
                                        }`,
                                        color: (theme) =>
                                            `${
                                                selectedDuLieuThuThap?.id ===
                                                    item.id &&
                                                theme.palette.mode === 'dark'
                                                    ? 'primary.dark'
                                                    : ''
                                            }`,
                                    }}
                                    onClick={() => {
                                        onSelectDuLieuThuThap(item);
                                    }}
                                >
                                    <ListItemText primary={`${item.name}`} />
                                </ListItem>
                            ))}
                    </ul>
                </li>
            </List>
        </div>
    );
};

ListDataTable.propTypes = {};
