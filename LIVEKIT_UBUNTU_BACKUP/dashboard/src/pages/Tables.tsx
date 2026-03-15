import { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Chip, Button,
} from '@mui/material';
import {
    EventSeat as TablesIcon,
    Add as AddIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { getTables } from '../api';

const locationConfig: Record<string, { color: string; bg: string }> = {
    interior: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)' },
    terraza: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
    privado: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
};

export default function Tables() {
    const [tables, setTables] = useState<any[]>([]);

    useEffect(() => {
        getTables().then((res) => setTables(res.data)).catch(console.error);
    }, []);

    return (
        <Box sx={{ animation: 'fadeInUp 0.4s ease-out' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.15) 100%)',
                        border: '1px solid rgba(6,182,212,0.2)',
                    }}>
                        <TablesIcon sx={{ color: '#22d3ee', fontSize: 22 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Gestión de Mesas</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />}>Añadir Mesa</Button>
            </Box>

            {/* Grid of Table Cards */}
            <Grid container spacing={3}>
                {tables.map((t, idx) => {
                    const loc = locationConfig[t.location] || locationConfig.interior;
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={t.id}>
                            <Card sx={{
                                height: '100%',
                                animation: `fadeInUp 0.4s ease-out ${idx * 60}ms both`,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, height: '3px',
                                    background: t.is_active
                                        ? `linear-gradient(90deg, ${loc.color}, transparent)`
                                        : 'linear-gradient(90deg, #475569, transparent)',
                                },
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography sx={{
                                            fontWeight: 700, fontSize: '1.8rem',
                                            background: t.is_active
                                                ? `linear-gradient(135deg, #f1f5f9 0%, ${loc.color} 150%)`
                                                : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            T{t.table_number}
                                        </Typography>
                                        <Chip
                                            label={t.is_active ? 'Activa' : 'Inactiva'}
                                            size="small"
                                            sx={{
                                                bgcolor: t.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                                                color: t.is_active ? '#10b981' : '#64748b',
                                                border: `1px solid ${t.is_active ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.2)'}`,
                                                fontWeight: 600, fontSize: '0.7rem',
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <PeopleIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                        <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                            {t.capacity} personas
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={t.location}
                                        size="small"
                                        sx={{
                                            bgcolor: loc.bg,
                                            color: loc.color,
                                            border: `1px solid ${loc.color}30`,
                                            fontWeight: 500, fontSize: '0.7rem', mt: 1,
                                            textTransform: 'capitalize',
                                        }}
                                    />
                                    {t.description && (
                                        <Typography sx={{ color: '#475569', fontSize: '0.75rem', mt: 1.5 }}>
                                            {t.description}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
