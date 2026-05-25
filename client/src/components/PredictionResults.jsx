import {
  Zap,
  CalendarDays,
  Home,
  Wallet,
  Sparkles,
  Info,
  AlertTriangle,
} from 'lucide-react';

import { Badge, Card, Divider, Text, Title } from '@tremor/react';
import DaisyCollapse from './DaisyCollapse';
import DaisySkeletonGrid from './DaisySkeletonGrid';
import TremorKpiCard from './TremorKpiCard';
import TremorCalloutList from './TremorCalloutList';
import TremorUsageMeter from './TremorUsageMeter';

function formatNumber(value, { decimals = 2 } = {}) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return '—';

  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numberValue);
}

function formatPHP(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return '—';

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

function getUsageCategory(monthlyBillPhp) {
  const bill = Number(monthlyBillPhp);
  if (!Number.isFinite(bill)) {
    return { label: 'Unknown', badgeColor: 'slate', progressValue: 0, tone: 'neutral' };
  }
  if (bill < 3000) return { label: 'Low usage', badgeColor: 'emerald', progressValue: 25, tone: 'low' };
  if (bill <= 7000) return { label: 'Moderate usage', badgeColor: 'amber', progressValue: 60, tone: 'moderate' };
  return { label: 'High usage', badgeColor: 'rose', progressValue: 90, tone: 'high' };
}

function getRecommendations({ tone, electricityRatePhpKwh, predictedHourlyKwh }) {
  const recommendations = [];

  if (tone === 'low') {
    recommendations.push('Your estimated usage is relatively low.');
    recommendations.push('Keep using eco modes and unplug idle chargers to stay efficient.');
  } else if (tone === 'moderate') {
    recommendations.push('Your estimated usage is moderate. Small adjustments can reduce your monthly bill.');
    recommendations.push('Consider reducing cooling appliance usage or setting AC to 25–26°C during peak hours.');
    recommendations.push('Batch high-power tasks (laundry/ironing) during off-peak times if your rate varies.');
  } else if (tone === 'high') {
    recommendations.push('High electricity demand detected. Monitor appliance usage during peak hours.');
    recommendations.push('Check always-on loads (old fridge, water heater, desktop PC) and optimize run times.');
    recommendations.push('If you use AC heavily, clean filters and seal drafts to reduce consumption.');
  } else {
    recommendations.push('Review your inputs and try again to generate reliable recommendations.');
  }

  const rate = Number(electricityRatePhpKwh);
  const hourly = Number(predictedHourlyKwh);
  if (Number.isFinite(rate) && rate > 0 && Number.isFinite(hourly) && hourly >= 0) {
    recommendations.push(`At your rate, this hour is roughly ${formatPHP(rate * hourly)}.`);
  }

  return recommendations;
}

export default function PredictionResults({ prediction, metadata, isLoading = false }) {
  if (isLoading) return <DaisySkeletonGrid />;
  if (!prediction) return null;

  const usage = getUsageCategory(prediction.estimated_monthly_bill_php);
  const recommendations = getRecommendations({
    tone: usage.tone,
    electricityRatePhpKwh: metadata?.electricity_rate_php_kwh,
    predictedHourlyKwh: prediction.predicted_hourly_kwh,
  });

  return (
    <div className="space-y-6">
      <Card className="bg-base-200 border border-base-300 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-7 h-7 text-primary mt-1" />
            <div>
              <Title className="text-base-content">Prediction Results</Title>
              <Text className="text-base-content/70">Summary of estimated usage and cost based on your inputs.</Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Text className="text-base-content/60">Category</Text>
            <Badge color={usage.badgeColor}>{usage.label}</Badge>
          </div>
        </div>

        <div className="mt-5">
          <TremorUsageMeter label="Usage category" value={usage.progressValue} color={usage.badgeColor} />
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TremorKpiCard
            title="Hourly demand"
            value={`${formatNumber(prediction.predicted_hourly_kwh)} kWh`}
            subtitle="For the selected hour"
            icon={<Zap className="w-6 h-6" />}
          />
          <TremorKpiCard
            title="Daily usage"
            value={`${formatNumber(prediction.estimated_daily_kwh)} kWh`}
            subtitle="Estimated total for a day"
            icon={<CalendarDays className="w-6 h-6" />}
          />
          <TremorKpiCard
            title="Monthly usage"
            value={`${formatNumber(prediction.estimated_monthly_kwh)} kWh`}
            subtitle="Estimated total for a month"
            icon={<Home className="w-6 h-6" />}
          />
          <TremorKpiCard
            title="Monthly bill"
            value={formatPHP(prediction.estimated_monthly_bill_php)}
            subtitle="Estimated cost at your rate"
            icon={<Wallet className="w-6 h-6" />}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-base-100 border border-base-300 lg:col-span-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            <Title className="text-base-content">Summary</Title>
          </div>
          <Text className="text-base-content/70 mt-2">
            This estimate is based on the usage values you entered and the current conditions. Use it for planning, not as an exact
            bill.
          </Text>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge color="slate">
              Rate: ₱{formatNumber(metadata?.electricity_rate_php_kwh, { decimals: 2 })}/kWh
            </Badge>
            <Badge color="slate">Temp: {formatNumber(metadata?.temperature_celsius, { decimals: 1 })}°C</Badge>
            <Badge color="slate">Hour: {metadata?.hour ?? '—'}</Badge>
          </div>
        </Card>

        <Card className="bg-base-100 border border-base-300 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <Title className="text-base-content">Recommendations</Title>
          </div>
          <div className="mt-3">
            <TremorCalloutList items={recommendations.slice(0, 2)} color={usage.badgeColor} />
            <ul className="mt-3 space-y-2 text-sm text-base-content/75">
              {recommendations.slice(2, 5).map((text, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <DaisyCollapse title="View raw prediction values">
        <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-xs font-mono text-base-content/80">
          {JSON.stringify(prediction, null, 2)}
        </pre>
      </DaisyCollapse>
    </div>
  );
}
