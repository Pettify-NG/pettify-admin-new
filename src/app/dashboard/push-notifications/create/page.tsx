'use client';

import { useState } from 'react';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import TextInput from '@/components/Global/TextInput';
import Button from '@/components/Global/Button';
import DatePicker from '@/components/Shared/DatePicker';

interface IPushNotificationPayload {
    body: string;
    target: "all_buyers" | "all_sellers";
    title: string;
    scheduledAt?: string;
}

export default function CreatePushNotificationPage() {
    const router = useRouter();
    const cookies = new Cookies();
    const token = cookies.get('pettify-token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [target, setTarget] = useState<'all_buyers' | 'all_sellers' | ''>('');
    const [sendNow, setSendNow] = useState(true);
    const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; body?: string; target?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { title?: string; body?: string; target?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!body.trim()) {
            newErrors.body = 'Body is required';
        }

        if (!target) {
            newErrors.target = 'Target is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);

        const payload: IPushNotificationPayload = {
            title: title.trim(),
            body: body.trim(),
            target: target as 'all_buyers' | 'all_sellers',
        };

        let endpoint = `${baseUrl}/api/v1/admin/push-notifications/send-now`;

        if (!sendNow) {
            if (!scheduledAt) {
                toast.error('Please select a scheduled date and time.');
                setLoading(false);
                return;
            }
            payload.scheduledAt = scheduledAt.toISOString();
            endpoint = `${baseUrl}/api/v1/admin/push-notifications/schedule`;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create push notification');
            }

            toast.success('Push notification created successfully!');
            router.push('/dashboard/push-notifications');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create Push Notification</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <TextInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={errors.title}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.body ? 'border-red-500' : 'border-gray-300'}`}
                        rows={4}
                        required
                    />
                    {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Target</label>
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value as 'all_buyers' | 'all_sellers' | '')}
                        className={`w-full p-2 border rounded text-black bg-[#F0F1F3] font-medium ${errors.target ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value='' className="text-gray-500" disabled>
                            Select the target of these push notifications...
                        </option>
                        <option value="all_buyers" className="text-gray-500">All Buyers</option>
                        <option value="all_sellers" className="text-gray-500">All Sellers</option>
                    </select>
                    {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Send Options</label>
                    <div className="flex items-center space-x-4">
                        <label>
                            <input
                                type="radio"
                                name="sendOption"
                                checked={sendNow}
                                onChange={() => setSendNow(true)}
                            />
                            Send Now
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="sendOption"
                                checked={!sendNow}
                                onChange={() => setSendNow(false)}
                            />
                            Schedule
                        </label>
                    </div>
                </div>
                {!sendNow && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Scheduled Date & Time</label>
                        <DatePicker handleSelectDate={(date) => setScheduledAt(date as Date)} />
                    </div>
                )}
                <Button type="submit" disabled={loading} className='text-white'>
                    {loading ? 'Creating...' : 'Create Notification'}
                </Button>
            </form>
        </div>
    );
}