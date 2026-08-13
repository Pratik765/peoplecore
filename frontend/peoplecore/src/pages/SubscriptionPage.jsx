import React, { useState } from "react";
import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Accordion from "../components/ui/Accordion";
import Modal from "../components/ui/Modal";
import {
  Crown,
  Check,
  Shield,
  Sparkles,
  Award,
  CreditCard,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  RefreshCw,
  Lock,
} from "lucide-react";

export function SubscriptionPage() {
  const { isLight } = useTheme();
  const { user } = useAuth();

  const [billingCycle, setBillingCycle] = useState("yearly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free Trial");

  const plans = [
    {
      id: "silver",
      name: "Silver",
      tagline: "Essential HR & Payroll for growing startups",
      badge: "Basic Plan",
      badgeColor: isLight ? "bg-slate-100 text-slate-700 border-slate-300" : "bg-slate-800 text-slate-300 border-slate-700",
      priceMonthly: 999,
      priceYearly: 799,
      employeeLimit: "Up to 25 Employees",
      popular: false,
      icon: Shield,
      features: [
        { text: "Core Employee Directory & Profiles", included: true },
        { text: "Standard Attendance & Leave Tracking", included: true },
        { text: "Basic Payroll Processing & Payslips", included: true },
        { text: "Email Notifications & Alerts", included: true },
        { text: "Announcement Board", included: true },
        { text: "Custom Leave Policy Rules", included: false },
        { text: "Advanced Payroll Tax Automation", included: false },
      ],
    },
    {
      id: "gold",
      name: "Gold",
      tagline: "Comprehensive solution for scaling companies",
      badge: "Most Popular",
      badgeColor: "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold border-amber-400",
      priceMonthly: 2499,
      priceYearly: 1999,
      employeeLimit: "Up to 100 Employees",
      popular: true,
      icon: Crown,
      features: [
        { text: "Core Employee Directory & Profiles", included: true },
        { text: "Standard Attendance & Leave Tracking", included: true },
        { text: "Basic Payroll Processing & Payslips", included: true },
        { text: "Email & In-App Push Notifications", included: true },
        { text: "Announcement & Broadcast Center", included: true },
        { text: "Custom Leave Policy Workflows", included: true },
        { text: "Advanced Payroll Tax & Deductions", included: true },
      ],
    },
    {
      id: "diamond",
      name: "Diamond",
      tagline: "Enterprise power with AI insights & full customization",
      badge: "Ultimate Enterprise",
      badgeColor: "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold border-cyan-400",
      priceMonthly: 4999,
      priceYearly: 3999,
      employeeLimit: "Unlimited Employees",
      popular: false,
      icon: Sparkles,
      features: [
        { text: "Everything in Gold Plan", included: true },
        { text: "Unlimited Employee Licenses", included: true },
        { text: "AI Insights & Attendance Fraud Detection", included: true },
        { text: "Dedicated Account Manager & 24/7 Phone", included: true },
        { text: "Custom API Access & Integrations", included: true },
      ],
    },
  ];

  const faqs = [
    { q: "Can I upgrade or downgrade my plan at any time?", a: "Yes! You can upgrade your plan at any point." },
    { q: "How does the 20% discount on yearly billing work?", a: "When you choose Annual Billing, you pay upfront for 12 months at a discounted rate." },
    { q: "Is payment processed securely?", a: "All subscriptions are processed through Razorpay PCI-DSS compliant gateway." },
  ];

  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setIsModalOpen(true);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      if (selectedPlan) setCurrentPlan(`${selectedPlan.name} Plan`);
    }, 1500);
  };

  return (
    <PageLayout>
      <PageHeader
        badgeText="Admin Subscription Hub"
        badgeIcon={Crown}
        title="Supercharge PeopleCore with"
        highlightTitle="Premium Plans"
        description="Unlock higher employee capacity, automated tax & payroll disbursal via Razorpay, custom leave approval flows, and 24/7 dedicated support."
        action={
          <ToggleSwitch
            checked={billingCycle === "yearly"}
            onChange={(val) => setBillingCycle(val ? "yearly" : "monthly")}
            leftLabel="Monthly"
            rightLabel="Annual"
            badgeText="Save 20%"
          />
        }
      />

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
          const isCurrent = currentPlan.toLowerCase().includes(plan.id);

          return (
            <Card
              key={plan.id}
              className={`p-7 flex flex-col justify-between relative ${
                plan.popular ? "ring-2 ring-amber-500/40 border-amber-500/60" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-slate-950" /> Most Popular
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    <h3 className={`text-2xl font-bold mt-1 ${isLight ? "text-slate-900" : "text-white"}`}>{plan.name}</h3>
                  </div>
                  <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <PlanIcon className="w-6 h-6" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] mb-6">{plan.tagline}</p>

                <div className="mb-6 pb-6 border-b border-slate-800/40">
                  <span className={`text-4xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400"> / month</span>
                  <div className="mt-2 text-xs font-semibold text-indigo-400">{plan.employeeLimit}</div>
                </div>

                <div className="space-y-2.5 mb-8">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className={feat.included ? (isLight ? "text-slate-700" : "text-slate-300") : "text-slate-500 line-through"}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                disabled={isCurrent}
                variant={plan.popular ? "amber" : "primary"}
                onClick={() => handleOpenCheckout(plan)}
                className="w-full py-3.5"
              >
                {isCurrent ? "Current Active Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" />
        <Accordion items={faqs} />
      </div>

      {/* Simulated Checkout Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Upgrade to ${selectedPlan?.name}`}>
        {paymentSuccess ? (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-400">Payment Successful!</h3>
            <p className="text-xs text-slate-400">Your subscription is now active on the {selectedPlan?.name} plan.</p>
            <Button onClick={() => setIsModalOpen(false)} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between"><span>Plan:</span><span className="font-bold text-white">{selectedPlan?.name}</span></div>
              <div className="flex justify-between"><span>Billing:</span><span className="capitalize">{billingCycle}</span></div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-800">
                <span>Total Amount:</span>
                <span className="text-amber-400">₹{(billingCycle === "yearly" ? selectedPlan?.priceYearly * 12 : selectedPlan?.priceMonthly)?.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Button loading={isProcessing} onClick={handleSimulatePayment} variant="amber" icon={CreditCard} className="w-full py-3">
              Proceed to Razorpay
            </Button>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}

export default SubscriptionPage;
