// @flow

export type ChannelType = 'facebook-page' | 'facebook-account' | 'instagram' | 'twitter' | 'ott' | 'youtube'

export type ChannelAnalyticsMetric = 'brutto_reach' | 'nett_reach' | 'followers' ;

export type DataChannelAnalyticsValues = {
    brutto_reach: number;
    nett_reach: number;
    shares: number;
    clicks: number;
    favourite: number;
    comments: number;
}

export type AnalyticsChannel = {
    summary: DataChannelAnalyticsValues;
    [date: string]: DataChannelAnalyticsValues;
};

//response of /api/analytics/channel
export type DataChannelAnalytics = {
    id: number;
    type: ChannelType;
    name: string;
    thumbnail : string;
    analytics: AnalyticsChannel;
}

export type DataChannelAnalyticsPeriod = '7days' | '28days';