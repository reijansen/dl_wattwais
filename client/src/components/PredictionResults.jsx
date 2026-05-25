import {
  Zap,
  CalendarDays,
  Home,
  Wallet,
  Sparkles,
  Info,
  AlertTriangle,
  BadgeInfo,
} from 'lucide-react';

import { AreaChart, BarChart, Card, Divider, DonutChart, Metric, Text, Title } from '@tremor/react';
import DaisyAlert from './DaisyAlert';
import DaisyBadge from './DaisyBadge';
import DaisyCollapse from './DaisyCollapse';
import DaisySkeletonGrid from './DaisySkeletonGrid';
import TremorKpiCard from './TremorKpiCard';
import TremorCalloutList from './TremorCalloutList';
import TremorUsageMeter from './TremorUsageMeter';

function clampNonNegative(numberValue) {
  const n = Number(numberValue);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

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
    return {
      label: 'Unknown',
      badgeVariant: 'outline',
      badgeClassName: '',
      progressValue: 0,
      tone: 'neutral',
      reason: 'Missing bill estimate.',
    };
  }

  if (bill < 3000) {
    return {
      label: 'Low usage',
      badgeVariant: 'success',
      badgeClassName: '',
      progressValue: 25,
      tone: 'low',
      reason: 'Estimated monthly bill is below ₱3,000.',
    };
  }
  if (bill <= 7000) {
    return {
      label: 'Moderate usage',
      badgeVariant: 'warning',
      badgeClassName: '',
      progressValue: 60,
      tone: 'moderate',
      reason: 'Estimated monthly bill is between ₱3,000 and ₱7,000.',
    };
  }
  return {
    label: 'High usage',
    badgeVariant: 'error',
    badgeClassName: '',
    progressValue: 90,
    tone: 'high',
    reason: 'Estimated monthly bill is above ₱7,000.',
  };
}

function getRecommendations(tone) {
  if (tone === 'low') {
    return [
      'Your estimated electricity use is relatively low.',
      'Keep using eco modes and unplug idle chargers to stay efficient.',
    ];
  }
  if (tone === 'moderate') {
    return [
      'Your usage is within a moderate range, but monitoring cooling appliances may help reduce costs.',
      'Consider setting AC to 25–26°C during peak hours to lower demand.',
      'Batch high-power tasks (laundry/ironing) when possible.',
    ];
  }
  if (tone === 'high') {
    return [
      'High estimated electricity demand detected. Consider reducing peak-hour usage or checking high-consumption appliances.',
      'Check always-on loads (old fridge, water heater, desktop PC) and optimize run times.',
      'If you use AC heavily, clean filters and seal drafts to reduce consumption.',
    ];
  }
  return ['Review your inputs and try again to generate reliable recommendations.'];
}

export default function PredictionResults({ prediction, metadata, isLoading = false }) {
  if (isLoading) return <DaisySkeletonGrid />;
  if (!prediction) return null;

  const rate = Number(metadata?.electricity_rate_php_kwh);
  const rateOk = Number.isFinite(rate) && rate > 0;

  const hourlyKwh = clampNonNegative(prediction.predicted_hourly_kwh);
  const dailyKwh = clampNonNegative(prediction.estimated_daily_kwh);
  const monthlyKwh = clampNonNegative(prediction.estimated_monthly_kwh);
  const monthlyBill = clampNonNegative(prediction.estimated_monthly_bill_php);

  // Derived analytics (usage)
  const weeklyKwh = dailyKwh * 7;
  const annualKwh = monthlyKwh * 12;

  // Derived analytics (cost)
  const hourlyCost = rateOk ? hourlyKwh * rate : NaN;
  const dailyCost = rateOk ? dailyKwh * rate : NaN;
  const weeklyCost = rateOk ? weeklyKwh * rate : NaN;
  const annualBill = monthlyBill * 12;
  const avgDailyCost = monthlyBill / 30;
  const avgHourlyCost = hourlyCost;

  const usage = getUsageCategory(monthlyBill);
  const tremorToneColor =
    usage.tone === 'low'
      ? 'emerald'
      : usage.tone === 'moderate'
        ? 'amber'
        : usage.tone === 'high'
          ? 'rose'
          : 'slate';
  const recommendations = getRecommendations(usage.tone);

  // For multi-colored bars, model each period as a separate category (Tremor colors map to categories).
  const usageCompareData = [
    {
      label: 'Usage',
      Daily: dailyKwh,
      Weekly: weeklyKwh,
      Monthly: monthlyKwh,
    },
  ];

  const costCompareData = [
    {
      label: 'Cost',
      Daily: Number.isFinite(dailyCost) ? dailyCost : 0,
      Weekly: Number.isFinite(weeklyCost) ? weeklyCost : 0,
      Monthly: monthlyBill,
    },
  ];

  const hourlySlice = Number.isFinite(hourlyCost) ? clampNonNegative(hourlyCost) : 0;
  const restOfDaySlice = Number.isFinite(dailyCost) ? clampNonNegative(dailyCost - hourlySlice) : 0;
  const restOfMonthSlice = clampNonNegative(monthlyBill - (Number.isFinite(dailyCost) ? dailyCost : 0));

  const donutData = [
    { name: 'This hour', value: hourlySlice },
    { name: 'Rest of day', value: restOfDaySlice },
    { name: 'Rest of month', value: restOfMonthSlice },
  ].filter((d) => d.value > 0);

  const donutColors = ['cyan', 'emerald', 'violet'].slice(0, donutData.length);

  const intensityData = Array.from({ length: 24 }).map((_, idx) => ({
    hour: `${idx + 1}h`,
    kwh: hourlyKwh,
  }));

  return (
    <div className="space-y-6">
      {!rateOk ? (
        <DaisyAlert
          type="warning"
          icon={<BadgeInfo className="w-6 h-6" />}
          title="Electricity rate not available"
          message="Cost analytics (₱) require your electricity rate. Please make sure the rate field is filled in, then predict again."
        />
      ) : null}

      <Card className="bg-base-200 border border-base-300 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-7 h-7 text-primary mt-1" />
            <div>
              <Title className="text-base-content">Results Dashboard</Title>
              <Text className="text-base-content/70">
                A mini dashboard of estimated usage and cost based on your inputs.
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60">Usage category</span>
            <DaisyBadge variant={usage.badgeVariant}>{usage.label}</DaisyBadge>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Text className="text-base-content/70">{usage.reason}</Text>
            <div className="text-sm text-base-content/60">
              Estimated monthly bill: <span className="font-semibold text-base-content">{formatPHP(monthlyBill)}</span>
            </div>
          </div>
          <div className="mt-4">
            <TremorUsageMeter label="Usage intensity" value={usage.progressValue} color={tremorToneColor} />
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TremorKpiCard
            title="Predicted hourly demand"
            value={`${formatNumber(hourlyKwh)} kWh`}
            subtitle="For the selected hour"
            icon={<Zap className="w-6 h-6" />}
          />
          <TremorKpiCard
            title="Estimated daily usage"
            value={`${formatNumber(dailyKwh)} kWh`}
            subtitle="Total for a day"
            icon={<CalendarDays className="w-6 h-6" />}
          />
          <TremorKpiCard
            title="Estimated monthly usage"
            value={`${formatNumber(monthlyKwh)} kWh`}
            subtitle="Total for a month"
            icon={<Home className="w-6 h-6" />}
          />
          <TremorKpiCard
            title="Estimated monthly bill"
            value={formatPHP(monthlyBill)}
            subtitle="Cost at your rate"
            icon={<Wallet className="w-6 h-6" />}
          />
        </div>
      </Card>

      {/* Secondary analytics */}
      <Card className="bg-base-100 border border-base-300 shadow-sm min-w-0">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <Title className="text-base-content">Secondary analytics</Title>
        </div>
        <Text className="text-base-content/70 mt-2">
          Additional estimates derived from the same prediction result (no extra backend fields).
        </Text>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <TremorKpiCard
            title="Weekly usage"
            value={`${formatNumber(weeklyKwh)} kWh`}
            subtitle="Daily × 7"
            icon={<CalendarDays className="w-6 h-6" />}
            size="md"
          />
          <TremorKpiCard
            title="Annual usage"
            value={`${formatNumber(annualKwh)} kWh`}
            subtitle="Monthly × 12"
            icon={<Home className="w-6 h-6" />}
            size="md"
          />
          <TremorKpiCard
            title="Annual bill"
            value={formatPHP(annualBill)}
            subtitle="Monthly × 12"
            icon={<Wallet className="w-6 h-6" />}
            size="md"
          />
          <TremorKpiCard
            title="Avg daily cost"
            value={formatPHP(avgDailyCost)}
            subtitle="Monthly ÷ 30"
            icon={<Wallet className="w-6 h-6" />}
            size="md"
          />
          <TremorKpiCard
            title="Avg hourly cost"
            value={rateOk ? formatPHP(avgHourlyCost) : '—'}
            subtitle="Hourly × rate"
            icon={<Zap className="w-6 h-6" />}
            size="md"
          />
        </div>
      </Card>

      {/* Cost breakdown */}
      <Card className="bg-base-100 border border-base-300 shadow-sm min-w-0">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <Title className="text-base-content">Cost breakdown</Title>
        </div>
        <Text className="text-base-content/70 mt-2">Estimated costs at your provided electricity rate.</Text>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <Card className="bg-base-100 border border-base-300 shadow-sm">
            <Text className="text-base-content/70">Hourly</Text>
            <Metric className="text-base-content tabular-nums text-2xl sm:text-3xl leading-tight whitespace-nowrap truncate">
              {rateOk ? formatPHP(hourlyCost) : '—'}
            </Metric>
          </Card>
          <Card className="bg-base-100 border border-base-300 shadow-sm">
            <Text className="text-base-content/70">Daily</Text>
            <Metric className="text-base-content tabular-nums text-2xl sm:text-3xl leading-tight whitespace-nowrap truncate">
              {rateOk ? formatPHP(dailyCost) : '—'}
            </Metric>
          </Card>
          <Card className="bg-base-100 border border-base-300 shadow-sm">
            <Text className="text-base-content/70">Weekly</Text>
            <Metric className="text-base-content tabular-nums text-2xl sm:text-3xl leading-tight whitespace-nowrap truncate">
              {rateOk ? formatPHP(weeklyCost) : '—'}
            </Metric>
          </Card>
          <Card className="bg-base-100 border border-base-300 shadow-sm">
            <Text className="text-base-content/70">Monthly</Text>
            <Metric className="text-base-content tabular-nums text-2xl sm:text-3xl leading-tight whitespace-nowrap truncate">
              {formatPHP(monthlyBill)}
            </Metric>
          </Card>
          <Card className="bg-base-100 border border-base-300 shadow-sm">
            <Text className="text-base-content/70">Annual</Text>
            <Metric className="text-base-content tabular-nums text-2xl sm:text-3xl leading-tight whitespace-nowrap truncate">
              {formatPHP(annualBill)}
            </Metric>
          </Card>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-base-100 border border-base-300 shadow-sm lg:col-span-2 min-w-0">
          <Title className="text-base-content">Usage comparison</Title>
          <Text className="text-base-content/70 mt-1">Daily vs weekly vs monthly usage (kWh).</Text>
          <div className="mt-4">
            <BarChart
              data={usageCompareData}
              index="label"
              categories={['Daily', 'Weekly', 'Monthly']}
              colors={['emerald', 'amber', 'cyan']}
              yAxisWidth={48}
              showLegend
              valueFormatter={(v) => `${formatNumber(v)} kWh`}
              className="h-72"
            />
          </div>
        </Card>

        <Card className="bg-base-100 border border-base-300 shadow-sm min-w-0">
          <Title className="text-base-content">Cost distribution</Title>
          <Text className="text-base-content/70 mt-1">
            Estimated share of costs (this hour vs the rest of the day and month).
          </Text>
          <div className="mt-4">
            {rateOk && donutData.length ? (
              <DonutChart
                data={donutData}
                category="value"
                index="name"
                colors={donutColors}
                valueFormatter={(v) => formatPHP(v)}
                className="h-64"
              />
            ) : (
              <div className="text-sm text-base-content/60">Provide a valid rate to view cost charts.</div>
            )}
          </div>
        </Card>

        <Card className="bg-base-100 border border-base-300 shadow-sm lg:col-span-2 min-w-0">
          <Title className="text-base-content">Cost comparison</Title>
          <Text className="text-base-content/70 mt-1">Daily vs weekly vs monthly cost (₱).</Text>
          <div className="mt-4">
            {rateOk ? (
              <BarChart
                data={costCompareData}
                index="label"
                categories={['Daily', 'Weekly', 'Monthly']}
                colors={['violet', 'amber', 'rose']}
                yAxisWidth={54}
                showLegend
                valueFormatter={(v) => formatPHP(v)}
                className="h-72"
              />
            ) : (
              <div className="text-sm text-base-content/60">Provide a valid rate to view cost charts.</div>
            )}
          </div>
        </Card>

        <Card className="bg-base-100 border border-base-300 shadow-sm min-w-0">
          <Title className="text-base-content">Usage intensity</Title>
          <Text className="text-base-content/70 mt-1">
            Simple intensity view (assumes similar demand for the next 24 hours).
          </Text>
          <div className="mt-4">
            <AreaChart
              data={intensityData}
              index="hour"
              categories={['kwh']}
              colors={['emerald']}
              showLegend={false}
              yAxisWidth={48}
              valueFormatter={(v) => `${formatNumber(v)} kWh`}
              className="h-64"
            />
          </div>
        </Card>
      </div>

      {/* Interpretation + recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-base-100 border border-base-300 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            <Title className="text-base-content">Interpretation</Title>
          </div>
          <Text className="text-base-content/70 mt-2">
            Based on your recent household usage values, the model estimates that your home may consume around{' '}
            <span className="font-semibold text-base-content">{formatNumber(monthlyKwh)}</span> kWh per month, resulting in an
            estimated bill of <span className="font-semibold text-base-content">{formatPHP(monthlyBill)}</span> at your provided
            electricity rate.
          </Text>

          <div className="mt-4 flex flex-wrap gap-2">
            <DaisyBadge variant="outline">Rate: {rateOk ? `₱${formatNumber(rate, { decimals: 2 })}/kWh` : '—'}</DaisyBadge>
            <DaisyBadge variant="outline">Temp: {formatNumber(metadata?.temperature_celsius, { decimals: 1 })}°C</DaisyBadge>
            <DaisyBadge variant="outline">Hour: {metadata?.hour ?? '—'}</DaisyBadge>
          </div>
        </Card>

        <Card className="bg-base-100 border border-base-300 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <Title className="text-base-content">Recommendations</Title>
          </div>
          <div className="mt-3">
            <TremorCalloutList items={recommendations.slice(0, 2)} color={tremorToneColor} />
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

      <DaisyAlert
        type="info"
        icon={<BadgeInfo className="w-6 h-6" />}
        title="Disclaimer"
        message="These values are estimates based on model prediction and user-provided inputs. Actual billing may vary depending on utility charges, taxes, fixed fees, and real household behavior."
      />

      <div className="pt-1">
        <div className="divider">Advanced</div>
      </div>

      <DaisyCollapse title="View raw prediction values (JSON)" className="shadow-sm" defaultOpen={false}>
        <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-xs font-mono text-base-content/80">
          {JSON.stringify(prediction, null, 2)}
        </pre>
      </DaisyCollapse>
    </div>
  );
}
