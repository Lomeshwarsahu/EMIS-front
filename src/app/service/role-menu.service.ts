import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const ROUTE_MAP: Record<string, string> = {
  // --- 1. Master Module ---
  '/master/storehome.aspx': '/masters/store-home',
  '/master/facility_home.aspx': '/masters/store-home',
  '/master/consigeeinformation.aspx': '/masters/consignee-information',
  '/master/reportspecification.aspx': '/masters/report-specification',
  '/master/cmeeelsuggestion.aspx': '/masters/cme-eel-suggestion',
  '/master/dhsaddfacility.aspx': '/masters/dhs-add-facility',
  '/master/dhsfacilityuserslocations.aspx': '/masters/dhs-facility-users-locations',
  '/master/healthfacilitydetails.aspx': '/masters/health-facility-details',
  '/master/itemspecification.aspx': '/masters/item-specification',
  '/master/masfacilityuserslocations.aspx': '/masters/mas-facility-users-locations',
  '/master/mastersupplieradd.aspx': '/masters/master-supplier-add',
  '/master/particularsupplieradd.aspx': '/masters/particular-supplier-add',
  '/master/suppliergstentry1.aspx': '/masters/supplier-gst-entry',

  // --- 2. Stock Module ---
  '/stock/facstockcoviditemsmc.aspx': '/stock/covid-stock-report',
  '/stock/existingcoviditemsdme.aspx': '/stock/opening-stock-entry',
  '/stock/newcoviditemdme.aspx': '/stock/new-opening-stock-entry',
  '/stock/facstockcmho.aspx': '/stock/covid-stock-report',
  '/stock/facprogress4cat.aspx': '/stock/progress-category',
  '/stock/facilityequipmentreceipt.aspx': '/stock/facility-receipts',
  '/stock/nodleinformationnew.aspx': '/stock/nodal-information',
  '/stock/progressdetail.aspx': '/stock/nodal-progress',
  '/stock/progressdetaildme.aspx': '/stock/nodal-progress',

  // --- 3. Orders & Transactions Module ---
  '/order/podashboarddmefac.aspx': '/orders/purchase-order-dashboard',
  '/order/facilitypo_supply_editdme.aspx': '/orders/purchase-order-receipts',
  '/order/masfileno.aspx': '/orders/mas-file-no',
  '/order/reportpoeligible.aspx': '/reports/eligible-report',
  '/order/porealloaction.aspx': '/orders/po-reallocation',
  '/order/emspoammendment.aspx': '/orders/po-amendment',
  '/order/payment20per.aspx': '/orders/withheld-release',
  '/order/paymentletter.aspx': '/payment-letter',
  '/order/poreceiptentry.aspx': '/orders/po-receipt-entry',
  '/order/facilitypo_supply_receiptdme.aspx': '/orders/po-receipt-entry',
  '/order/poinstallationreport.aspx': '/orders/po-installation-report',
  '/order/facility_installationreportdme.aspx': '/orders/po-installation-report',
  '/order/poprint.aspx': '/orders/po-print',
  '/order/rdlcporeportdme.aspx': '/orders/po-print',
  '/orders/po-supply.aspx': '/orders/po-supply',
  '/orders/po-supply-sd-detail.aspx': '/orders/po-supply-sd-detail',
  '/orders/po-supply-apply-extension.aspx': '/orders/po-supply-apply-extension',
  '/transaction/po-supply-dispatch.aspx': '/transaction/po-supply-dispatch',
  '/transaction/po-supply-dispatch-edit.aspx': '/transaction/po-supply-dispatch-edit',
  '/transaction/po-supply-dispatch-entry.aspx': '/transaction/po-supply-dispatch-entry',
  '/transaction/po-supply-dispatch-report.aspx': '/transaction/po-supply-dispatch-report',
  '/transaction/po-supply-receipt.aspx': '/transaction/po-supply-receipt',
  '/transaction/po-supply-receipt-entry.aspx': '/transaction/po-supply-receipt-entry',
  '/transaction/po-supply-installation-report.aspx': '/transaction/po-supply-installation-report',
  '/transaction/po-supply-installation-print.aspx': '/transaction/po-supply-installation-print',
  '/transaction/po-supply-po-print.aspx': '/transaction/po-supply-po-print',

  // --- 4. Contracts Module ---
  '/contract/rcextend.aspx': '/RCExtend',
  '/contract/rcextendadmin.aspx': '/RCExtend',
  '/contract/rcdetailreport.aspx': '/contracts/rc-detail-report',
  '/contract/rcdetailreportforsupplier.aspx': '/contracts/rc-detail-report-supplier',
  '/contract/acceptedreoprtsupplier.aspx': '/contracts/accepted-report-supplier',
  '/contracts/rc-detail-report-supplier.aspx': '/contracts/rc-detail-report-supplier',
  '/contracts/accepted-report-supplier.aspx': '/contracts/accepted-report-supplier',

  // --- 5. Indents Module ---
  '/indent/dmefacheads.aspx': '/indents/budget-heads',
  '/indent/consolidatedindentdme_mc.aspx': '/indents/annual-indent',
  '/indent/dmefacaddindent.aspx': '/indents/annual-indent-items',
  '/indent/dmefacindentreport.aspx': '/indents/annual-indent-report',
  '/indent/consolidatedindentpocell.aspx': '/ConsolidatedIndentPOCell',
  '/indent/consolidatedindentdhspo.aspx': '/ConsolidatedIndentDHSPO',
  '/indent/indentwiseitemremarks.aspx': '/IndentWiseItemRemarks',
  '/indent/indenteditdhspo.aspx': '/IndentEditDHSPO',
  '/indent/dhsindentaddbulkconsigneepo.aspx': '/DHSindentAddBulkConsigneePO',
  '/indent/consolidatedindentcgmsc.aspx': '/ConsolidatedIndentCGMSC',
  '/indent/indentfromfacilities.aspx': '/indents/from-facilities',
  '/indent/indentrcpotenderstatus.aspx': '/reports/indent-po-tender-status',

  // --- 6. Reports Module ---
  '/reports/cmcdetail.aspx': '/reports/cmc-detail',
  '/reports/mainequipmentmappedreport.aspx': '/reports/main-equipment-mapped',
  '/reports/reportpoeligible.aspx': '/reports/eligible-report',
  '/reports/indentpotenderstatus.aspx': '/reports/indent-po-tender-status',
  '/reports/indentpotenderstatussummary.aspx': '/reports/indent-po-tender-status-summary',
  '/reports/indentpotendersummary.aspx': '/reports/indent-po-tender-summary',
  '/reports/paymentreport.aspx': '/reports/payment-report',
  '/reports/sanctionsrdlc.aspx': '/reports/sanction-report',
  '/reports/balancestatussupplier.aspx': '/reports/pending-receipt-installation',
  '/reports/posummary.aspx': '/reports/po-summary',

  // --- 7. Complain Module ---
  '/complain/facilitycomplainstore.aspx': '/complain/facility-store',
  '/complain/complaintstatus.aspx': '/complain/complaint-status',
  '/complain/complaintstatusfacility.aspx': '/complain/complaint-status-facility',
  '/complain/complaincmho.aspx': '/complain/complain-cmho',
  '/complain/receiptcomplainsupplier.aspx': '/complain/receipt-complain-supplier',

  // --- 8. BME & Tender Cell Module ---
  '/bme/masttersupplierdash.aspx': '/MasterSupplierDash',
  '/bme/itemsbme.aspx': '/ItemsBME',
  '/bme/mapitemseithtype.aspx': '/masters/map-items',
  '/bme/mapitemswithtypeupdate.aspx': '/masters/map-items-update',
  '/bme/mapitemswithmainitemtyperepo.aspx': '/masters/map-items-report',
  '/bme/emsrcdashbord.aspx': '/contracts/dashboard',
  '/bme/emsnewrc.aspx': '/contracts/new-rc',
  '/bme/planatenderd.aspx': '/tender/plan',
  '/bme/tenderstatusupdate.aspx': '/tender/evaluation',
  '/bme/addrtenderitems.aspx': '/tender/claim-object',
  '/bme/tendercovera.aspx': '/TenderCoverA',
  '/bme/tendercoveraobclaim.aspx': '/TenderCoverAObClaim',
  '/bme/tenderitemspricegem.aspx': '/TenderItemsPriceGEM',
  '/bme/tenderdetailspriceentrygem.aspx': '/TenderDetailsPriceEntryGEM',
  '/bme/tendercoveraitems.aspx': '/TenderCoverAitems',
  '/bme/coveraitemsreports.aspx': '/reports/cover-a-items-reports',

  // --- 9. PO Cell Module ---
  '/pocell/masfacilityusers.aspx': '/MasFacilityUsers',
  '/pocell/programmaster.aspx': '/ProgramMaster',
  '/pocell/emspodashboard.aspx': '/EMSPODashboard',
  '/pocell/emsnewpo.aspx': '/EMSNEWPO',
  '/pocell/rcextend.aspx': '/RCExtend',
  '/pocell/appliedpoextension.aspx': '/AppliedPoExtension',
  '/pocell/consolidatedindentdhspo.aspx': '/ConsolidatedIndentDHSPO',
  '/pocell/indentwiseitemremarks.aspx': '/IndentWiseItemRemarks',
  '/pocell/indenteditdhspo.aspx': '/IndentEditDHSPO',
  '/pocell/dhsindentaddbulkconsigneepo.aspx': '/DHSindentAddBulkConsigneePO',
  '/pocell/termsconditions.aspx': '/Termsconditions',
  '/pocell/rdlctendersummary.aspx': '/RDLCTenderSummary',

  // --- 10. GM Finance Module ---
  '/gmfinance/editreceivedandinstallationdate.aspx': '/EditReceivedAndInstallationDate',
  '/gmfinance/suppliers.aspx': '/masters/supplier',
  '/gmfinance/supplierbankaccounts.aspx': '/SupplierBankAccounts',
  '/gmfinance/suppliergstentry.aspx': '/SupplierGSTentry',
  '/gmfinance/cgmscbankaccounts.aspx': '/CgmscBankAccounts',
  '/gmfinance/newfundmaster.aspx': '/NewFundMaster',
  '/gmfinance/fundmap.aspx': '/FundMap',
  '/gmfinance/budgententry.aspx': '/BudgentEntry',
  '/gmfinance/budgetdetailsprovisional.aspx': '/BudgetDetailsProvisional',
  '/gmfinance/filemrcdashboardfinfile.aspx': '/FileMRCDashboardFINFile',
  '/gmfinance/sanction.aspx': '/Sanction',
  '/gmfinance/popaidreport.aspx': '/reports/po-paid-report',
  '/gmfinance/chequewisepaymentreport.aspx': '/finance/cheque-wise-payment',
  '/gmfinance/facilityauthpovaluepocell.aspx': '/finance/year-wise-po-abstract',
  '/gmfinance/fpopaidreport.aspx': '/finance/po-wise-payment',

  // --- 10b. Payment Module (Direct Mappings) ---
  '/payment/payment20per.aspx': '/orders/withheld-release',
  '/payment/paymentletter.aspx': '/payment-letter',
  '/payment/sanctionsrdlc.aspx': '/reports/sanction-report',
  '/payment/paymentscpreport.aspx': '/reports/payments-cpreport',
  '/payment/paymentscpreportigm.aspx': '/reports/payments-cpreport',
  '/payment/paymentscpreport20per.aspx': '/reports/payments-cpreport',
  '/payment/sanction.aspx': '/Sanction',
  '/payment/sanctions.aspx': '/reports/sanction-report',
  '/payment/editreceivedandinstallationdate.aspx': '/EditReceivedAndInstallationDate',
  '/payment/installationdetailsfinctrl.aspx': '/PendingInstallDrillDown',
  '/payment/installationdetailsfin.aspx': '/PendingInstallDrillDown',
  '/payment/podetailsrdlcfin.aspx': '/PODetailsRDLC',

  // --- 11. Performance Module ---
  '/performance/performancecertificate.aspx': '/PerformanceCertificate',
  '/performance/performace20consignee.aspx': '/performance/performace20-consignee',
  '/performance/performancecertificatefin.aspx': '/performance/performance-certificate-fin',
  '/performance/emisperf20rdlc.aspx': '/performance/emis-perf20-rdlc',
  '/performance/payment20chequeprep.aspx': '/performance/payment20-cheque-prep',
  '/performance/sanctionnotesheet.aspx': '/performance/sanction-notesheet',

  // --- 12. File Movement Module ---
  '/filemovement/generationfilenonasti.aspx': '/GenerationFileNonasti',
  '/filemovement/filemrcdashbord.aspx': '/FileMRCDashbord',
  '/filemovement/filemrcdashboardfin.aspx': '/FileMRCDashboardFIN',
  '/filemovement/filemrcdashboardgm.aspx': '/FileMRCDashboardGM',
  '/filemovement/filemrcdashboardigm.aspx': '/FileMRCDashboardIGM',
  '/filemovement/filemrcdashboardfinfile.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/emdfileapproval.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/logoverifiedho.aspx': '/LogoVerifiedHO',
  '/filemovement/sitenotreadydocupload.aspx': '/SiteNotReadyDocUpload',
  '/filemovement/invoicesbyso.aspx': '/InvoicesBySO',
  '/filemovement/poreportnew.aspx': '/PoReportNew',

  // --- 13. IT Module ---
  '/it/addsubmenu.aspx': '/IT/add-sub-menu',
  '/it/addroleinscreen.aspx': '/IT/add-role-in-screen',
  '/it/deletemenu.aspx': '/IT/delete-menu',

  // --- 14. Additional EMD & Refund Routes ---
  '/emdrefund/sdreleasefinance.aspx': '/emd-refund/sd-release-finance',
  '/emdrefund/emdrefundreport.aspx': '/reports/emd-refund-report',

  // --- 15. Additional Stock & Equipment Routes ---
  '/stock/equipmenttagging.aspx': '/reports/equipment-tag',

  // --- 16. Additional Report Variants ---
  '/reports/equipmenttagreport.aspx': '/reports/equipment-tag',
  '/reports/invoicedetail.aspx': '/reports/payment-report',
  '/reports/tdsdatareport.aspx': '/reports/payment-report',
  '/reports/indent_reportpocell.aspx': '/indents/annual-indent-report',
  '/reports/indent_rc_po_tender_status.aspx': '/reports/indent-po-tender-status',
  '/reports/facilityauthpovalue_pocell.aspx': '/finance/year-wise-po-abstract',

  // --- 17. Additional PO Cell & Order Variants ---
  '/pocell/applyforextensionho.aspx': '/AppliedPoExtension',
  '/pocell/emspodashboardfin.aspx': '/EMSPODashboard',
  '/order/facilitypo_receipt1.aspx': '/orders/po-receipt-entry',
  '/order/facilitypo_receiptdme.aspx': '/orders/po-receipt-entry',
  '/order/facility_installationreport.aspx': '/orders/po-installation-report',
  '/order/facilitypo_supply_receiptho.aspx': '/orders/po-receipt-entry',
  '/order/facilitypo_supply_edit.aspx': '/orders/purchase-order-receipts',
  '/order/podashboardfacility.aspx': '/orders/purchase-order-dashboard',
  '/order/sddetailsupplier.aspx': '/orders/po-supply-sd-detail',
  '/order/sddetailsupplierforbme.aspx': '/orders/po-supply-sd-detail',
  '/order/supplierdispatchpendingcons_ho.aspx': '/transaction/po-supply-dispatch-report',
  '/order/supplierdispatchpendinginsta_ho.aspx': '/orders/po-installation-report',
  '/order/supplierdispatchpending_ho.aspx': '/transaction/po-supply-dispatch-report',
  '/order/po_supplyho.aspx': '/orders/po-supply',
  '/order/po_supply_details.aspx': '/orders/po-supply-sd-detail',

  // --- 18. Additional Audit Mappings ---
  '/master/emddeposite.aspx': '/emd-refund/emd-deposit',
  '/master/mapitemwithtype_update.aspx': '/masters/map-items-update',
  '/master/mainequipmentmappedreport.aspx': '/reports/main-equipment-mapped',
  '/master/suppliergstentry.aspx': '/masters/supplier-gst-entry',
  '/stock/facstockcoviditems.aspx': '/stock/covid-stock-report',
  '/stock/existingcoviditems.aspx': '/stock/opening-stock-entry',
  '/stock/newcoviditemd.aspx': '/stock/new-opening-stock-entry',
  '/stock/nodelcredential.aspx': '/stock/nodal-information',
  '/funds/newfundmaster.aspx': '/NewFundMaster',
  '/funds/budgetdetailsprovisional.aspx': '/BudgetDetailsProvisional',
  '/funds/fundmap.aspx': '/FundMap',
  '/funds/budgententry.aspx': '/BudgentEntry',
  '/emdrefund/emdrefundtenderwise.aspx': '/reports/emd-refund-report',
  '/reports/emddepositereport.aspx': '/emd-refund/emd-deposit',
  '/reports/tenderwise_podetails.aspx': '/orders/purchase-order-dashboard',
  '/reports/paymentscpreport20per.aspx': '/reports/payments-cpreport',
  '/reports/posummarydrilldwnqtyreagent.aspx': '/reports/po-summary-drilldown-qty-reagent',
  '/reports/indentpotenderstatussummarydrldwnitems.aspx': '/reports/indent-po-tender-status-drilldown',
  '/reports/posummaryconsigneeho.aspx': '/reports/po-summary-consignee-ho',
  '/reports/tenderstatusitemwise.aspx': '/tender/evaluation',
  '/reports/rdlc_dhspending.aspx': '/reports/pending-install-drill-down',
  '/reports/tenderstatus.aspx': '/tender/evaluation',
  '/reports/complainreportbme.aspx': '/reports/complain-report-bme',
  '/reports/indentposummarydirwise.aspx': '/reports/indent-po-summary-dirwise',
  '/reports/balancestatusdhs.aspx': '/reports/pending-receipt-installation',
  '/reports/facstockcoviditemsbme.aspx': '/stock/covid-stock-report',
  '/reports/reportindentpodetails.aspx': '/reports/eligible-report',
  '/reports/emdrefundreport.aspx': '/reports/emd-refund-report',
  '/reports/dispatchdetail.aspx': '/transaction/po-supply-dispatch-report',
  '/reports/openingstocksummarydrilldwnstock.aspx': '/stock/covid-stock-report',
  '/reports/posummarydirectorate.aspx': '/reports/po-summary-directorate',
  '/reports/paymentscpreportigm.aspx': '/reports/payments-cpreport',
  '/reports/paymentscpreport.aspx': '/reports/payments-cpreport',
  '/reports/balancesupplierwise.aspx': '/reports/pending-receipt-installation',
  '/reports/balancestatuspocell.aspx': '/reports/pending-receipt-installation',
  '/reports/popaidreport.aspx': '/reports/po-paid-report',
  '/reports/eel_suggestionreport.aspx': '/masters/cme-eel-suggestion',
  '/reports/pendingposupwise.aspx': '/reports/pending-receipt-installation',
  '/reports/porecdsummary.aspx': '/reports/po-receipt-summary',
  '/reports/indentpotendersummarydrldwnitems.aspx': '/reports/indent-po-tender-summary-drilldown',
  '/reports/itemwisedetail_poqty.aspx': '/reports/item-wise-detail-poqty',
  '/reports/cmhoposummary.aspx': '/reports/cmho-po-summary',
  '/reports/pendinginstalldrilldownpocell.aspx': '/reports/pending-install-drill-down',
  '/reports/popaidreportigm.aspx': '/reports/po-paid-report',
  '/reports/tenderlivestatus.aspx': '/tender/evaluation',
  '/reports/openingstocksummary.aspx': '/stock/covid-stock-report',
  '/reports/cmhoposummarydrilldwnqty.aspx': '/reports/cmho-po-summary-drilldown',
  '/reports/poreportgmf.aspx': '/reports/po-paid-report',
  '/reports/pendinginstalldrilldowndhs.aspx': '/reports/pending-install-drill-down',
  '/reports/tenderlivestatusdrilldown.aspx': '/tender/evaluation',
  '/reports/itemwisedetail_poqty_pocell.aspx': '/reports/item-wise-detail-poqty-pocell',
  '/reports/posummarydirectoratedrilldwnqty.aspx': '/reports/po-summary-directorate-drilldown',
  '/reports/itemwisedetail_pocell.aspx': '/reports/item-wise-detail-poqty-pocell',
  '/reports/posummarydrilldwnqty.aspx': '/reports/po-summary-drilldown-qty',
  '/reports/itemwisedetail.aspx': '/reports/item-wise-detail-poqty',
  '/reports/unpaidpos.aspx': '/reports/po-paid-report',
  '/reports/receiptpendingcmho1.aspx': '/reports/pending-receipt-installation',
  '/reports/districtwisepodetail.aspx': '/reports/district-wise-po-detail',
  '/reports/posummarydrilldwnqtypowise.aspx': '/reports/po-summary-drilldown-qty-powise',

  // --- 19. Final Audit Folder Variants ---
  '/pocell/emsnewrc.aspx': '/contracts/new-rc',
  '/pocell/applied_po_extension.aspx': '/AppliedPoExtension',
  '/pocell/incompletereceiptinstallation.aspx': '/orders/po-installation-report',
  '/pocell/emspoammendment.aspx': '/orders/po-amendment',
  '/pocell/emsrcdashboard.aspx': '/contracts/dashboard',
  '/pocell/sddetailsupplierforbme.aspx': '/orders/po-supply-sd-detail',
  '/pocell/po_supplyho.aspx': '/orders/po-supply',
  '/pocell/rdlcporeport.aspx': '/orders/po-print',
  '/pocell/incompletedispatch.aspx': '/transaction/po-supply-dispatch',
  '/pocell/porealloaction.aspx': '/orders/po-reallocation',
  '/master/mastersupplierdash.aspx': '/MasterSupplierDash',
  '/master/programmaster.aspx': '/ProgramMaster',
  '/master/cgmscbankaccounts.aspx': '/CgmscBankAccounts',
  '/master/mapitemwithtype.aspx': '/masters/map-items',
  '/master/suppliers.aspx': '/masters/supplier',
  '/master/supplierbankaccounts.aspx': '/SupplierBankAccounts',
  '/master/itemsbme.aspx': '/ItemsBME',
  '/master/masfacilityusers.aspx': '/MasFacilityUsers',
  '/master/report_specification.aspx': '/masters/report-specification',
  '/filemovement/installationdetailsfinctrl.aspx': '/PendingInstallDrillDown',
  '/filemovement/sitenotreadydoc_upload.aspx': '/SiteNotReadyDocUpload',
  '/filemovement/filemrcdashboardigmmovaudit.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/emdfileapprovalbankletter.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/filemrcdashboardfinfile_ver1.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/filemrcdashboardigmmov.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/masfileno.aspx': '/orders/mas-file-no',
  '/filemovement/podetailsrdlc.aspx': '/PODetailsRDLC',
  '/filemovement/filemrcdashboardigmmovbme.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/filemrcdashboardgmnew.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/installationdetailsgmt.aspx': '/PendingInstallDrillDown',
  '/filemovement/emdfileapprovalbme.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/pendinginstalldrilldown.aspx': '/PendingInstallDrillDown',
  '/filemovement/emdfileapprovalgmf.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/emdfileapprovalgmfsanction.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/installationdetailsbme.aspx': '/PendingInstallDrillDown',
  '/filemovement/emdfileapprovalgmt.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/filemrcdashboarddm.aspx': '/FileMRCDashboardFINFile',
  '/payment/payments.aspx': '/reports/payment-report',
  '/payment/chequenotesheetrdlc.aspx': '/performance/sanction-notesheet',
  '/payment/payment.aspx': '/reports/payment-report',
  '/payment/paymentscp.aspx': '/reports/payments-cpreport',
  '/payment/psanctions.aspx': '/reports/sanction-report',
  '/payment/logoverifiedfin.aspx': '/LogoVerifiedHO',
  '/payment/psanction.aspx': '/Sanction',
  '/performance/sanctionnotsheet.aspx': '/performance/sanction-notesheet',
  '/performance/performace20_consignee.aspx': '/performance/performace20-consignee',
  '/performance/emisperf20_rdlc.aspx': '/performance/emis-perf20-rdlc',
  '/performance/payment20cheequprep.aspx': '/performance/payment20-cheque-prep',
  '/performace20_consignee.aspx': '/performance/performace20-consignee',

  // --- 20. Tender & Remaining Module Variants ---
  '/tender/terms_conditions.aspx': '/Termsconditions',
  '/tender/addtendercon.aspx': '/tender/plan',
  '/tender/tendercoveraobclaim.aspx': '/TenderCoverAObClaim',
  '/tender/tender_details_12.aspx': '/tender/plan',
  '/tender/tenderstatusremark.aspx': '/tender/evaluation',
  '/tender/coveraitemsreports.aspx': '/reports/cover-a-items-reports',
  '/tender/tender_details_not_found.aspx': '/tender/plan',
  '/tender/tender_details_itemsexcel.aspx': '/TenderCoverAitems',
  '/tender/tenderstatus.aspx': '/tender/evaluation',
  '/tender/tender_details_priceentrygem.aspx': '/TenderDetailsPriceEntryGEM',
  '/tender/cova.aspx': '/TenderCoverA',
  '/tender/tendercoverbshortlisting.aspx': '/tender/evaluation',
  '/tender/tender_details_items.aspx': '/TenderCoverAitems',
  '/tender/tendercovera.aspx': '/TenderCoverA',
  '/tender/tender_details_priceentry.aspx': '/TenderDetailsPriceEntryGEM',
  '/tender/addexcel.aspx': '/tender/plan',
  '/tender/tender_details_1.aspx': '/tender/plan',
  '/tender/tendercoveraobclaimafterb.aspx': '/TenderCoverAObClaim',
  '/tender/covaitemsentry.aspx': '/TenderCoverAitems',
  '/tender/tendercoveraobclaimafter.aspx': '/TenderCoverAObClaim',
  '/tender/tendercoveraitems.aspx': '/TenderCoverAitems',
  '/tender/tenderitemspricegem.aspx': '/TenderItemsPriceGEM',
  '/tender/addleavy.aspx': '/tender/plan',
  '/tender/tender_details_priceentryonly.aspx': '/TenderDetailsPriceEntryGEM',
  '/tender/rdlctendersummary.aspx': '/RDLCTenderSummary',
  '/tender/tenderitemspricear.aspx': '/TenderItemsPriceGEM',

  '/contract/emsnewrc.aspx': '/contracts/new-rc',
  '/contract/applied_po_extension.aspx': '/AppliedPoExtension',
  '/contract/rcdetailreportcmho.aspx': '/contracts/rc-detail-report',
  '/contract/emsrcdashboard.aspx': '/contracts/dashboard',
  '/contract/rcdetailreportfacility.aspx': '/contracts/rc-detail-report',
  '/contract/acceptedreport.aspx': '/contracts/accepted-report-supplier',
  '/contract/emsrcdashboardfin.aspx': '/contracts/dashboard',

  '/complain/complainreportbme.aspx': '/reports/complain-report-bme',
  '/complain/facilitycomplain.aspx': '/complain/facility-store',
  '/complain/complaintstatusfacilityedit.aspx': '/complain/complaint-status-facility',
  '/complain/complaintstatusedit.aspx': '/complain/complaint-status',
  '/complain/complainreportdhs.aspx': '/complain/complaint-status',

  '/transaction/facility_installationreportsup.aspx': '/transaction/po-supply-installation-report',
  '/transaction/po_supply_edit.aspx': '/orders/purchase-order-receipts',
  '/transaction/facilitypo_receipt1_sup.aspx': '/orders/po-receipt-entry',
  '/transaction/po_supplydispatch.aspx': '/transaction/po-supply-dispatch',
  '/transaction/facilitypo_supply_receiptsup_underconstruction.aspx': '/transaction/po-supply-receipt',
  '/transaction/po_supply_details.aspx': '/orders/po-supply-sd-detail',
  '/transaction/po_supply_details_reagent.aspx': '/orders/po-supply-sd-detail',
  '/transaction/rptdispatchdetails.aspx': '/transaction/po-supply-dispatch-report',
  '/transaction/facilitypo_supply_receiptsup.aspx': '/transaction/po-supply-receipt',

  '/it/masfacilityusers.aspx': '/MasFacilityUsers',
  '/filemovement/installationdetailsdeo.aspx': '/PendingInstallDrillDown',
  '/filemovement/installationdetailsdeonew.aspx': '/PendingInstallDrillDown',
};



function mapLegacyRoute(route: string): string {
  if (!route) return '';
  const raw = route.trim();

  // Separate path from query string & hash (e.g. "/Stock/FACProgress4Cat.aspx?type=1" -> "/Stock/FACProgress4Cat.aspx")
  const pathOnly = raw.split('?')[0].split('#')[0].trim();
  const lower = pathOnly.toLowerCase();

  // 1. Direct match in override map
  if (ROUTE_MAP[lower]) {
    return ROUTE_MAP[lower];
  }

  // 2. If it's already a clean Angular route (doesn't contain .aspx)
  if (!lower.includes('.aspx')) {
    return pathOnly.startsWith('/') ? pathOnly : '/' + pathOnly;
  }

  // 3. Remove .aspx extension and leading slashes/tilde
  let clean = pathOnly.replace(/\.aspx$/i, '').replace(/^~?\//, '');

  // 4. Check clean route in override map
  const cleanLower = '/' + clean.toLowerCase();
  if (ROUTE_MAP[cleanLower]) {
    return ROUTE_MAP[cleanLower];
  }

  // 5. Extract page name (e.g. "Stock/FACStockCOVIDItemsMC" -> "FACStockCOVIDItemsMC")
  const parts = clean.split('/');
  const pageName = parts[parts.length - 1];

  return '/' + pageName;
}





export interface RoleDto {
  RoleId: number;
  RoleName: string;
}

export interface MenuDto {
  MenuId: number;
  MenuName: string;
  MenuLink: string;
  MenuOrder: number;
  IsActive: boolean;
}

export interface SubMenuDto {
  SubMenuId: number;
  SubMenuName: string;
  SubMenuLink: string;
  MenuId: number;
  MenuName: string;
  SubMenuOrder: number;
  IsActive: boolean;
}

export interface SubMenuWithRoleStatusDto extends SubMenuDto {
  AddedOrNot: number;
}

export interface SubMenuRoleMappingDto {
  SMControlId: number;
  SubMenuId: number;
  SubMenuName: string;
  SubMenuLink: string;
  MenuId: number;
  MenuName: string;
  RoleId: number;
  RoleName: string;
}

export interface RoleMenuGridDto {
  MenuId: number;
  MenuName: string;
  RoleId: number;
  RoleName: string;
  NoOfSubMenus: number;
  MenuOrder: number;
}

export interface CreateSubMenuRequest {
  SubMenuName: string;
  SubMenuLink: string;
  MenuId: number;
}

export interface MapRoleScreenRequest {
  RoleId: number;
  MenuId: number;
  SubMenuIds: number[];
}

export interface RenameMenuRequest {
  NewName: string;
}

export interface RemoveSubMenuRoleRequest {
  SubMenuId: number;
  SMControlId: number;
}

@Injectable({ providedIn: 'root' })
export class RoleMenuService {
  private readonly api = `${environment.apiUrl}/IT`;

  constructor(private readonly http: HttpClient) {}

  getRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.api}/roles`);
  }

  getMenus(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${this.api}/menus`);
  }

  getMenusAll(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${this.api}/menus/all`);
  }

  getSubMenus(menuId: number): Observable<SubMenuDto[]> {
    return this.http.get<SubMenuDto[]>(`${this.api}/menus/${menuId}/submenus`);
  }

  createSubMenu(req: CreateSubMenuRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/submenus`, req);
  }

  renameMenu(menuId: number, newName: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/menus/${menuId}`, { NewName: newName });
  }

  renameSubMenu(id: number, newName: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/submenus/${id}`, { NewName: newName });
  }

  getSubMenusWithRoleStatus(menuId: number, roleId: number): Observable<SubMenuWithRoleStatusDto[]> {
    return this.http.get<SubMenuWithRoleStatusDto[]>(
      `${this.api}/menus/${menuId}/submenus-with-role-status?roleId=${roleId}`
    );
  }

  getSubMenuMappingsForRole(roleId: number, menuId?: number): Observable<SubMenuRoleMappingDto[]> {
    let url = `${this.api}/roles/${roleId}/submenu-mappings`;
    if (menuId != null) url += `?menuId=${menuId}`;
    return this.http.get<SubMenuRoleMappingDto[]>(url);
  }

  mapScreensToRole(req: MapRoleScreenRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/roles/map-screens`, req);
  }

  getMenuGridForRole(roleId: number): Observable<RoleMenuGridDto[]> {
    return this.http.get<RoleMenuGridDto[]>(`${this.api}/roles/${roleId}/menu-grid`);
  }

  getSubMenusInRole(roleId: number, menuId: number): Observable<SubMenuRoleMappingDto[]> {
    return this.http.get<SubMenuRoleMappingDto[]>(
      `${this.api}/roles/${roleId}/menus/${menuId}/submenus-in-role`
    );
  }

  deleteMenuFromRole(roleId: number, menuId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/roles/${roleId}/menus/${menuId}`);
  }

  removeSubMenusFromRole(roleId: number, items: RemoveSubMenuRoleRequest[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/roles/${roleId}/remove-submenus`, items);
  }

  getSidebarTreeForRole(roleId: number): Observable<{ label: string; route: string; submenu?: { label: string; route: string }[] }[]> {
    return this.http.get<any[]>(`${this.api}/sidebar-tree/${roleId}`).pipe(
      map((rawItems) => {
        if (!Array.isArray(rawItems)) return [];
        return rawItems
          .map((item) => {
            const label = item.label || item.Label || '';
            const rawRoute = item.route || item.Route || '';
            const rawSubmenu = item.submenu || item.Submenu || [];

            const submenu = Array.isArray(rawSubmenu)
              ? rawSubmenu
                  .map((sub: any) => ({
                    label: sub.label || sub.Label || '',
                    route: mapLegacyRoute(sub.route || sub.Route || ''),
                  }))
                  .filter((sub) => sub.route !== '/home' && sub.route !== '/' && sub.route !== '/welcome')
              : undefined;

            return {
              label,
              route: mapLegacyRoute(rawRoute),
              submenu: submenu && submenu.length > 0 ? submenu : undefined,
            };
          })
          .filter((item) => !!item.label && (!!item.route || (item.submenu && item.submenu.length > 0)));
      })
    );
  }
}


