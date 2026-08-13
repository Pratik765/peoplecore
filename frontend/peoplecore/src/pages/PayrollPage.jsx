import React from "react";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import ViewScopeToggle from "../components/common/ViewScopeToggle";
import FilterBar from "../components/ui/FilterBar";
import SearchBar from "../components/ui/SearchBar";
import Button from "../components/ui/Button";
import SalaryStructureCard from "../components/payroll/SalaryStructureCard";
import PayslipTable from "../components/payroll/PayslipTable";
import ConfigureCtcModal from "../components/payroll/ConfigureCtcModal";
import usePayrollData from "../hooks/usePayrollData";
import useAuth from "../hooks/useAuth";
import { MONTHS_LIST } from "../utils/constants";
import { Receipt, Plus, Sparkles, Layers } from "lucide-react";

export function PayrollPage() {
  const { isHR } = useAuth();
  const {
    viewScope,
    setViewScope,
    salaryStructure,
    loading,
    actionLoading,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    showCtcModal,
    setShowCtcModal,
    targetEmployeeId,
    setTargetEmployeeId,
    targetCtc,
    setTargetCtc,
    monthFilter,
    setMonthFilter,
    searchQuery,
    setSearchQuery,
    handleConfigureCtc,
    handleGenerateBatch,
    pagination,
  } = usePayrollData();

  return (
    <PageLayout>
      <PageHeader
        badgeText="Payroll & Disbursal"
        badgeIcon={Receipt}
        title="Compensation Structures &"
        highlightTitle="Payslip History"
        description="View annual CTC breakdown, automated tax calculations, and monthly payslip disbursal history."
        action={
          <div className="flex items-center gap-3">
            <ViewScopeToggle viewScope={viewScope} onChangeScope={setViewScope} />
            {isHR && viewScope === "all" && (
              <>
                <Button icon={Plus} onClick={() => setShowCtcModal(true)}>
                  Configure CTC
                </Button>
                <Button variant="amber" icon={Sparkles} loading={actionLoading} onClick={handleGenerateBatch}>
                  Run Batch Payslips
                </Button>
              </>
            )}
          </div>
        }
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      {/* Salary Structure Component */}
      {viewScope === "my" && <SalaryStructureCard structure={salaryStructure} />}

      {/* Payslip History Section */}
      <div className="space-y-4">
        <SectionHeader
          icon={Layers}
          title="Generated Payslips History"
          action={
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <FilterBar
                filters={MONTHS_LIST.slice(0, 7)}
                activeFilter={monthFilter}
                onSelectFilter={setMonthFilter}
              />
              {isHR && viewScope === "all" && (
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search payslips..." />
              )}
            </div>
          }
        />

        <PayslipTable
          payslips={pagination.paginatedItems}
          loading={loading}
          pagination={pagination}
          showEmployeeColumn={isHR && viewScope === "all"}
        />
      </div>

      {/* HR Configure CTC Modal */}
      <ConfigureCtcModal
        show={showCtcModal}
        onClose={() => setShowCtcModal(false)}
        onSubmit={handleConfigureCtc}
        employeeId={targetEmployeeId}
        setEmployeeId={setTargetEmployeeId}
        ctc={targetCtc}
        setCtc={setTargetCtc}
        submitting={actionLoading}
      />
    </PageLayout>
  );
}

export default PayrollPage;
