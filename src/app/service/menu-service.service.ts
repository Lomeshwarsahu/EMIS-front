import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuServiceService {
  private selectedCategory:
    | 'DrugsConsumables'
    | 'EquipmentReagent'
    | 'Infrastructure'
    | 'Admin'
    | undefined;
  private menu: {
    [role: string]: {
      categories?: {
        [category: string]: {
          label: string;
          route: string;
          submenu?: { label: string; route: string }[];
        }[];
      };
      items?: {
        label: string;
        route: string;
        submenu?: { label: string; route: string }[];
      }[];
    };
  } = {
    SEC1: {
      categories: {
        DrugsConsumables: [
          { label: 'Home', route: '/home' },

          {
            label: 'Oracle Analytics',
            route: '', // 👈 empty string or '/welcome' as placeholder
            submenu: [
              { label: 'Tender Status', route: '/oracle-dashboard' },
              { label: 'PO Planning', route: '/po-planning-oracle' },
              { label: 'Current Stock', route: '/CurrentStockOracle' },
              { label: 'Near Expiry', route: '/Near-Expiry-Oracle' },
              { label: 'Pipeline Supplies ', route: '/PipelineSuppliesOracle' },
              {
                label: 'ABCVEDSDE Analysis',
                route: '/ABCVEDSDEAnalysisOracle',
              },
              { label: 'QC Analysis', route: '/QCAnalysisOracle' },
              {
                label: 'Facility Information',
                route: '/FacilityInformationOracle',
              },
            ],
          },
          { label: 'Dashboard', route: '/welcome' },
          { label: 'Analysis', route: '/analysis' },
          { label: 'Attendance', route: '/attendance-dash' },
          { label: 'Conversation Hod ', route: '/conversationHodCgmsc' },
          { label: 'Tender Status', route: '/tender-status' },
          { label: 'QC Insights ', route: '/qc-dashboard' },
          { label: 'Hold Batch History', route: '/holdbatchhistory' },
          { label: 'Finance', route: '/finance-dash' },
          { label: 'Supplier Pending Payments', route: '/supplier-pending' },
          { label: 'DHS Dashboard', route: '/dhsdash' },
          { label: 'CME Dashboard', route: '/cmedash' },
          { label: 'CME Lifting Status', route: '/cme-lifting-dash' },
          { label: 'Warehouse Wise', route: '/w-wise' },
          { label: 'Non Supply', route: '/nonsupply' },
          {
            label: 'Med. Coll/Hospital Indent vs Issuance/NOC',
            route: '/institute-wise-issuance',
          },
          { label: 'Noc', route: '/dmefacnoc' },
          { label: 'EMD Drugs/Consumables', route: '/emd' },
          { label: 'Health Facilities Coverage', route: '/FacCoverage' },
          { label: 'Warehouse Information', route: '/WarehouseInfo' },
          { label: 'Warehouse Stock Abstract', route: '/whStockAbstract' },
          { label: 'Warehouse Stock Details', route: '/stockDetails' },
          { label: 'Field Stock', route: '/field-stock' },
          { label: 'Warehouse Stock-out %', route: '/StockoutSummary' },
          { label: 'Warehouse Indent Pending', route: '/IndentPendingWHdash' },
          { label: 'Seasonal Drugs', route: '/SeasonDrugs' },
          { label: 'Growth In Procurment', route: '/GrowthInProcurmentTab' },
          { label: 'Growth in Distribution', route: '/distribution' },
          { label: 'Consumption Pattern', route: '/consumption-pattern' },
          { label: 'Near Expiry', route: '/nearExpiry' },
          { label: 'Devlivery', route: '/Devlivery' },
          { label: 'Quality Control', route: '/qc-dashboard' },
          {
            label: 'Quality Control Track',
            submenu: [
              { label: 'QC Courier', route: '/QcPendings' },
              { label: 'QC-Lab Issues', route: '/qc-dash' },
            ],
            route: '/welcome',
          },
          { label: 'IWH Pendings', route: '/iwhPending' },
          { label: 'NOC', route: '/noc' },
          { label: 'ANPR Report ', route: '/vehicleTracking' },
          { label: 'WH Wise Stock Out', route: '/WHWiseStockOut' },
          {
            label: 'Time-Based Analysis',

            submenu: [
              {
                label: 'Door Delivery App Uses',
                route: '/DropAppWarehousePerformance',
              },
              {
                label: 'Time Taken By Supplier',
                route: '/timetakenBySupplier',
              },
              { label: 'Paid Time Taken', route: '/PaidTimeTaken' },
              { label: 'QC Time Taken', route: '/QcTimeTaken' },
            ],
            route: '/welcome',
          },
        ],
        EquipmentReagent: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/eqp-dash' },
          { label: 'RCDetail', route: '/Rcdetail' },
          { label: 'Complaints', route: '/complaints' },
          { label: 'Supply/Installation Status', route: '/dispatchPending' },
          { label: 'Orders', route: '/dhs' },
          { label: 'Reagent Issue', route: '/ReagentIssue' },
        ],
        Infrastructure: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/infra-dash' },
          { label: 'Search Work', route: '/SearchingWork' },

          { label: 'Work Abstract', route: '/InfrastructureHome' },

          { label: 'Progress on Scheme', route: '/SchemeWiseDetails' },
          {
            label: 'Administrative Sanction',
            route: '/AdministrativeSanction',
          },

          { label: 'Live Tender', route: '/LiveTender' },
          { label: ' Evaluation', route: '/TenderEvaluation' },
          { label: 'To be Tender', route: '/ToBeTender' },

          { label: 'Work Order', route: '/WorkOrder' },
          { label: 'Running Works', route: '/RunningWork' },
          { label: 'Land Issues', route: '/LandIssue' },
          { label: 'Technical Sanction', route: '/TechnicalSanction' },
          {
            label: 'Monitoring with Geographic Coordinate',
            route: 'DivisionProgress',
          },
          { label: 'Handover', route: '/Handover' },

          { label: 'Engineer-Works', route: '/EngineerWorks' },
          { label: 'Payment', route: '/PriceEvaluation' },
        ],
        Admin: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/admin-dash' },
          { label: 'Attendance', route: '/attendance-dash' },
        ],
      },
    },
    SSO: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Dashboard', route: '/welcome' },

        { label: 'DHS Dashboard', route: '/dhsdash' },
        { label: 'CME Dashboard', route: '/cmedash' },
        {
          label: 'Med. Coll/Hospital Indent vs Issuance/NOC',
          route: '/institute-wise-issuance',
        },

        { label: 'Health Facilities Coverage', route: '/FacCoverage' },
        { label: 'Warehouse Information', route: '/WarehouseInfo' },
        { label: 'Warehouse Stock Abstract', route: '/whStockAbstract' },
        { label: 'Warehouse Stock Details', route: '/stockDetails' },
        { label: 'Field Stock', route: '/field-stock' },
        { label: 'Warehouse Stock-out %', route: '/StockoutSummary' },
        { label: 'Warehouse Indent Pending', route: '/IndentPendingWHdash' },
        { label: 'Seasonal Drugs', route: '/SeasonDrugs' },
        { label: 'Near Expiry', route: '/nearExpiry' },
      ],
    },
    'Logi Cell': {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Dashboard', route: '/welcome' },

        { label: 'DHS Dashboard', route: '/dhsdash' },
        { label: 'CME Dashboard', route: '/cmedash' },
        {
          label: 'Med. Coll/Hospital Indent vs Issuance/NOC',
          route: '/institute-wise-issuance',
        },

        { label: 'Health Facilities Coverage', route: '/FacCoverage' },
        { label: 'Warehouse Information', route: '/WarehouseInfo' },
        { label: 'Warehouse Stock Abstract', route: '/whStockAbstract' },
        { label: 'Warehouse Stock Details', route: '/stockDetails' },
        { label: 'Field Stock', route: '/field-stock' },
        { label: 'Warehouse Stock-out %', route: '/StockoutSummary' },
        { label: 'Warehouse Indent Pending', route: '/IndentPendingWHdash' },
        { label: 'Seasonal Drugs', route: '/SeasonDrugs' },
        { label: 'Near Expiry', route: '/nearExpiry' },
        { label: 'IWH Pendings', route: '/iwhPending' },
      ],
    },

    // AD: {
    //   items: [
    //     { label: 'Home', route: '/home' },
    //     { label: 'RC Details Report', route: '/RCDetailReport' }, //contracts
    //     { label: 'Price Accepted Report', route: '/AcceptedReort' }, //contracts
    //     { label: 'Indent From Facilities', route: '/IndentFromFacilities' }, //Indent
    //     { label: 'Complain Report', route: '/ComplainReportBME' }, //Complain
    //     { label: 'Year Wise PO Abstract', route: '/FacilityAuthPOValuePOCell' }, //Finance
    //     { label: 'PO Wise Payment Report', route: '/POPaidReport' }, //Finance
    //     {
    //       label: 'Cheque Wise Payment Report',
    //       route: '/ChequeWisePaymentReport',
    //     }, //Finance
    //     { label: ' PO Summary', route: '/POSummaryReport' }, //Report
    //     { label: ' PO Wise Payment Report', route: '/ChequeWisePaymentReport' }, //Report
    //     { label: ' Tenders Status', route: '/TendersStatus' }, //Report
    //   ],
    // },
    AD: {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Contracts',
          route: '',
          submenu: [
            {
              label: 'RC Details Report',
              route: '/contracts/rc-detail-report',
            },
            { label: 'Price Accepted Report', route: '/AcceptedReort' },
          ],
        },
        {
          label: 'Indents',
          route: '',
          submenu: [
            {
              label: 'Indent From Facilities',
              route: '/indents/from-facilities',
            },
          ],
        },
        {
          label: 'Finance Report',
          route: '',
          submenu: [
            {
              label: 'Year Wise PO Abstract',
              route: '/finance/year-wise-po-abstract',
            },
            {
              label: 'PO Wise Payment FReport',
              route: '/finance/po-wise-payment',
            },
            {
              label: 'Cheque Wise Payment Report',
              route: '/finance/cheque-wise-payment',
            },
          ],
        },
        {
          label: 'Complain',
          route: '',
          submenu: [{ label: 'Complain Report', route: '/complain/report' }],
        },
        {
          label: 'Reports',
          route: '',
          submenu: [
            { label: 'PO Summary', route: '/reports/po-summary' },
            {
              label: 'PO Wise Payment Report',
              route: '/reports/po-wise-payment',
            },
            { label: 'Tenders Status', route: '/reports/tenders-status' },
            {
              label: 'PO Receipts summary',
              route: '/reports/po-receipts-summary',
            },
            {
              label: 'Item Status in Tenter',
              route: '/reports/tender-item-status',
            },
            { label: 'Reagent PO Report', route: '/reports/reagent-po' },
          ],
        },
      ],
    },
    AU: {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Masters',
          route: '',
          submenu: [
            { label: 'Supplier', route: '/masters/supplier' },
            { label: 'Add New Items', route: '/masters/items' },
            { label: 'Mapping to Main items', route: '/masters/map-items' },
            {
              label: 'Update Mapping to Main items',
              route: '/masters/map-items-update',
            },
            {
              label: 'Main Equipment Mapped Report',
              route: '/masters/map-items-report',
            },
          ],
        },
        {
          label: 'Contracts',
          route: '',
          submenu: [
            { label: 'Contract Dashboard', route: '/contracts/dashboard' },
            { label: 'New Contract', route: '/contracts/new-rc' },
          ],
        },
        {
          label: 'Tender',
          route: '',
          submenu: [
            { label: 'Plan a Tender', route: '/PlanaTenderD' },
            { label: 'Evaluation A', route: '/TenderCoverA' },
            {
              label: 'Claim-Object Preparation',
              route: '/TenderCoverAObClaim',
            },
            {
              label: 'Gem-Price Entry Acceptance',
              route: '/TenderItemsPriceGEM',
            },
            { label: 'Gem-Price Entry', route: '/TenderDetailsPriceEntryGEM' },
          ],
        },
        {
          label: 'Indents',
          route: '',
          submenu: [
            { label: 'Add Indent DME', route: 'ConsolidatedIndentPOCell' },
            // { label: 'Indent From Facilities', route: '/indents/from-facilities' }
          ],
        },
        {
          label: 'Finance Report',
          route: '',
          submenu: [
            {
              label: 'Year Wise PO Abstract',
              route: '/finance/year-wise-po-abstract',
            },
            {
              label: 'PO Wise Payment FReport',
              route: '/finance/po-wise-payment',
            },
            {
              label: 'Cheque Wise Payment Report',
              route: '/finance/cheque-wise-payment',
            },
          ],
        },
        {
          label: 'Complain',
          route: '',
          submenu: [{ label: 'Complain Report', route: '/complain/report' }],
        },
        {
          label: 'Reports',
          route: '',
          submenu: [
            { label: 'PO Summary', route: '/reports/po-summary' },
            {
              label: 'PO Wise Payment Report',
              route: '/reports/po-wise-payment',
            },
            { label: 'Tenders Status', route: '/reports/tenders-status' },
            {
              label: 'PO Receipts summary',
              route: '/reports/po-receipts-summary',
            },
            {
              label: 'Item Status in Tenter',
              route: '/reports/tender-item-status',
            },
            { label: 'Reagent PO Report', route: '/reports/reagent-po' },
          ],
        },
      ],
    },

    AUPO: {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Masters',
          route: '',
          submenu: [
            { label: 'Health Facility Users', route: '/MasFacilityUsers' },
            { label: 'Add New Items', route: '/ItemsBME' },
            { label: 'Program Master', route: 'ProgramMaster' },
            // { label: 'Mapping to Main items', route: '/masters/map-items' },
            // { label: 'Update Mapping to Main items', route: '/masters/map-items-update' },
            // { label: 'Main Equipment Mapped Report', route: '/masters/map-items-report' },
          ],
        },
        {
          label: 'Orders',
          route: '',
          submenu: [
            { label: 'Extension HO Detail', route: '/ExtensionHODetail' },
            { label: 'Purchase Order', route: '/EMSPODashboard' },
            { label: 'Extension HO Detail', route: '/ExtensionHODetail' },
          ],
        },
        {
          label: 'Contracts',
          route: '',
          submenu: [
            { label: 'Contract Dashboard', route: 'contracts/dashboard' },
            { label: 'New Contract', route: '/contracts/new-rc' },
            { label: 'RC Extension', route: '/RCExtend' },
            { label: 'PO Extension', route: '/AppliedPoExtension' },
            {
              label: 'RC Details Report',
              route: '/contracts/rc-detail-report',
            },
            { label: 'Price Accepted Report', route: '/AcceptedReort' },
          ],
        },
        {
          label: 'Tender',
          route: '',
          submenu: [
            { label: 'Plan a Tender', route: '/PlanaTenderD' },
            { label: 'Terms & Conditions', route: '/Termsconditions' },
            { label: 'RDLC Tender Summary', route: '/RDLCTenderSummary' },
            // { label: 'Gem-Price Entry Acceptance', route: '/TenderItemsPriceGEM' },
            // { label: 'Gem-Price Entry', route: '/TenderDetailsPriceEntryGEM' }
          ],
        },
        {
          label: 'Indents',
          route: '',
          submenu: [
            { label: 'Add Indent DME', route: 'ConsolidatedIndentPOCell' },
            { label: 'Add Indent', route: '/ConsolidatedIndentDHSPO' },
            { label: 'Indent Item Wise Remarks', route: '/IndentWiseItemRemarks' }
          ],
        },
        {
          label: 'Finance Report',
          route: '',
          submenu: [
            { label: 'Year Wise PO Abstract', route: '/finance/year-wise-po-abstract' },
            { label: 'PO Wise Payment FReport', route: '/finance/po-wise-payment' },
            // { label: 'Cheque Wise Payment Report', route: '/finance/cheque-wise-payment' }
          ],
        },
        // {
        //   label: 'Complain',
        //   route: '',
        //   submenu: [{ label: 'Complain Report', route: '/complain/report' }],
        // },
        {
          label: 'Reports',
          route: '',
          submenu: [
            { label: 'PO Summary', route: '/reports/po-summary' },
            {
              label: 'PO Wise Payment Report',
              route: '/reports/po-wise-payment',
            },
            { label: 'Tenders Status', route: '/reports/tenders-status' },
            {
              label: 'PO Receipts summary',
              route: '/reports/po-receipts-summary',
            },
            {
              label: 'Item Status in Tenter',
              route: '/reports/tender-item-status',
            },
            { label: 'Reagent PO Report', route: '/reports/reagent-po' },
          ],
        },
      ],
    },
    AUGMF: {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Masters',
          route: '',
          submenu: [
            { label: 'Health Facility Users', route: '/EditReceivedAndInstallationDate' },
            { label: 'Suppliers Accounts/GST', route: '/Supplier' },
            { label: 'CGMSCL Bank Accounts', route: '/CgmscBankAccounts' },
            // { label: 'Add New Items', route: '/ItemsBME' },
            // { label: 'Program Master', route: 'ProgramMaster' },
            // { label: 'Mapping to Main items', route: '/masters/map-items' },
            // { label: 'Update Mapping to Main items', route: '/masters/map-items-update' },
            // { label: 'Main Equipment Mapped Report', route: '/masters/map-items-report' },
          ],
        },
        {
          label: 'Funds',
          route: '',
          submenu: [
            { label: 'Add Funds', route: '/NewFundMaster' },
            { label: 'Fund Map', route: '/FundMap' },
            { label: 'Budgent Entry', route: '/BudgentEntry' },
          ],
        },
            {
          label: 'Reports',
          route: '',
          submenu: [
            { label: 'Tenders Status', route: 'reports/tenders-status' },
            { label: 'Indent/RC/PO Tender Status', route: '/IndentRCPOTenderStatus' },
            { label: 'Unpaid PO Details', route: '/UnpaidPOS' },
        
            { label: 'District wise PO Details', route: '/DistrictWisePODetail' },
           
            { label: 'PO Report Year Wise', route: 'POReportGMF' },
          ],
        },
        {
          label: 'Orders',
          route: '',
          submenu: [
            // { label: 'Extension HO Detail', route: '/ExtensionHODetail' },
            // { label: 'Purchase Order', route: '/EMSPODashboard' },
            // { label: 'Extension HO Detail', route: '/ExtensionHODetail' },
          ],
        },
        {
          label: 'Contracts',
          route: '',
          submenu: [
            // { label: 'Contract Dashboard', route: 'contracts/dashboard' },
            // { label: 'New Contract', route: '/contracts/new-rc' },
            // { label: 'RC Extension', route: '/RCExtend' },
            // { label: 'PO Extension', route: '/AppliedPoExtension' },
            // {
            //   label: 'RC Details Report',
            //   route: '/contracts/rc-detail-report',
            // },
            // { label: 'Price Accepted Report', route: '/AcceptedReort' },
          ],
        },
        {
          label: 'Tender',
          route: '',
          submenu: [
            // { label: 'Plan a Tender', route: '/PlanaTenderD' },
            // { label: 'Terms & Conditions', route: '/Termsconditions' },
            // { label: 'RDLC Tender Summary', route: '/RDLCTenderSummary' },
            // { label: 'Gem-Price Entry Acceptance', route: '/TenderItemsPriceGEM' },
            // { label: 'Gem-Price Entry', route: '/TenderDetailsPriceEntryGEM' }
          ],
        },
        {
          label: 'Indents',
          route: '',
          submenu: [
            // { label: 'Add Indent DME', route: 'ConsolidatedIndentPOCell' },
            // { label: 'Add Indent', route: '/ConsolidatedIndentDHSPO' },
            // { label: 'Indent Item Wise Remarks', route: '/IndentWiseItemRemarks' }
          ],
        },
        {
          label: 'Finance Report',
          route: '',
          submenu: [
            { label: 'Year Wise PO Abstract', route: '/finance/year-wise-po-abstract' },
            { label: 'Invoice Details/e-Way Bills', route: '/InvoiceDetail' },
            { label: 'PO Wise Payment FReport', route: '/finance/po-wise-payment' },
            { label: 'Cheque Wise Payment Report', route: '/finance/cheque-wise-payment' },
            { label: 'TDS Report', route: '/TDSdataReport' },
            { label: '20% Release Report', route: '/PaymentsCPReport20per' }
          ],
        },
        // {
        //   label: 'Complain',
        //   route: '',
        //   submenu: [{ label: 'Complain Report', route: '/complain/report' }],
        // },
    
      ],
    },

    DME: {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Masters',
          route: '',
          submenu: [
            {
              label: 'Medical College Contact Details',
              route: '/masters/store-home',
            },
            {
              label: 'Report-Specification',
              route: '/masters/report-specification',
            },
          ],
        },
        {
          label: 'Stock',
          route: '',
          submenu: [
            { label: 'COVID Stock (MC)', route: '/stock/covid-stock-report' },
            {
              label: 'Opening Stock Reports',
              route: '/stock/opening-stock-entry',
            },
          ],
        },
        {
          label: 'Orders',
          route: '',
          submenu: [
            {
              label: 'Purchase Orders (Facility)',
              route: '/orders/purchase-order-dashboard',
            },
            {
              label: 'Purchase Order Receipts',
              route: '/orders/purchase-order-receipts',
            },
          ],
        },
        {
          label: 'Contracts',
          route: '',
          submenu: [
            {
              label: 'RC Details Report',
              route: '/contracts/rc-detail-report',
            },
          ],
        },
        {
          label: 'Tender',
          route: '',
          submenu: [
            { label: 'Plan a Tender', route: '/tender/plan' },
            { label: 'Evaluation A', route: '/tender/evaluation' },
            {
              label: 'Claim-Object Preparation',
              route: '/tender/claim-object',
            },
            {
              label: 'Gem-Price EAcceptance',
              route: '/tender/gem-price-acceptance',
            },
            { label: 'Gem-Price Entry', route: '/tender/plan' },
          ],
        },
        {
          label: 'Indents',
          route: '',
          submenu: [
            { label: 'Indent Budget Heads', route: '/indents/budget-heads' },
            { label: 'Annual Indent', route: '/indents/annual-indent' },
            {
              label: 'Indent From Facilities',
              route: '/indents/from-facilities',
            },
          ],
        },
        {
          label: 'Reports',
          route: '',
          submenu: [{ label: 'CMC Detail', route: '/reports/cmc-detail' }],
        },
        {
          label: 'Complain',
          route: '',
          submenu: [
            {
              label: 'Facility Complain (Store)',
              route: '/complain/facility-store',
            },
            { label: 'Complain Report', route: '/complain/report' },
          ],
        },
      ],
    },

    TPO: {
      items: [
        // { label: 'Home', route: '/home' },
        { label: 'Home', route: '/home' },
        {
          label: 'Masters',
          route: '',
          submenu: [
            { label: 'Generation FileNo', route: '/GenerationFileNonasti' },
          ],
        },
        {
          label: 'Orders',
          route: '',
          submenu: [
            { label: 'Extension HO Detail', route: '/ExtensionHODetail' },
          ],
        },

        {
          label: 'Reports',
          route: '',
          submenu: [
            {
              label: 'Item Wise Detail PO Cell',
              route: '/ItemWiseDetailPOCell',
            },
            {
              label: 'District Wise PO Detail',
              route: '/DistrictWisePODetail',
            },
            {
              label: 'Indent PO Summary Dirwise',
              route: '/IndentPOSummaryDirwise',
            },
          ],
        },
        {
          label: 'File Movements',
          route: '',
          submenu: [{ label: 'File MRC Dashboard', route: '/FileMRCDashbord' }],
        },
        // { label: '  Generation FileNo', route: '/GenerationFileNonasti' },

        // { label: '  Generation FileNo', route: '/GenerationFileNonasti' },

        // { label: 'Dashboard', route: '/eqp-dash' },
        // { label: 'RCDetail', route: '/Rcdetail' },
        // { label: 'Complaints', route: '/complaints' },
        // { label: 'Supply/Installation Status', route: '/dispatchPending' },
        // { label: 'Orders', route: '/dhs' },
        // { label: 'Reagent Issue', route: '/ReagentIssue' },
      ],
    },
    MDGMT: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Dashboard', route: '/eqp-dash' },
        { label: 'RCDetail', route: '/Rcdetail' },
        { label: 'Complaints', route: '/complaints' },
        { label: 'Supply/Installation Status', route: '/dispatchPending' },
        { label: 'Orders', route: '/dhs' },
        { label: 'Reagent Issue', route: '/ReagentIssue' },
      ],
    },
    TPOBME: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Dashboard', route: '/eqp-dash' },
        { label: 'RCDetail', route: '/Rcdetail' },
        { label: 'Complaints', route: '/complaints' },
        { label: 'Supply/Installation Status', route: '/dispatchPending' },
        { label: 'Orders', route: '/dhs' },
        { label: 'Reagent Issue', route: '/ReagentIssue' },
      ],
    },

    Collector: {
      categories: {
        DrugsConsumables: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/card' },
          { label: 'Facilities Coverage', route: '/FacCoverage' },
          { label: 'CGMSC Supplies', route: '/cgmsc-supplies' },
          { label: 'Stock Details', route: '/stockDetails' },
          { label: 'District DHS Stock', route: '/DistDHSStock' },
          { label: 'Facility Wise Stock', route: '/FacilityWiseStock' },
          { label: 'DdlItemWiseInHandQty', route: '/DdlItemWiseInHandQty' },
          { label: 'Indent Delivery Entry', route: '/Devlivery' },

          { label: 'Growth in Distribution', route: '/HODYearWiseIssuance' },
          { label: 'Warehouse Indent Pending', route: '/IndentPendingWHdash' },
          { label: 'Seasonal Drugs', route: '/SeasonDrugs' },
        ],
        EquipmentReagent: [{ label: 'Home', route: '/home' }],
        Infrastructure: [
          { label: 'Verticals', route: '/home' },
          { label: 'Search Work', route: '/SearchingWork' },
          { label: 'Work Abstract', route: '/InfrastructureHome' },

          { label: 'Work Order', route: '/WorkOrder' },
        ],
      },
    },
    DHS: {
      categories: {
        DrugsConsumables: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/dhsdash' },
          { label: 'Finance', route: '/finance-dash' },
          { label: 'Health Facilities Coverage', route: '/FacCoverage' },
          { label: 'Warehouse Information', route: '/WarehouseInfo' },
          { label: 'Stock Abstract', route: '/whStockAbstract' },
          { label: 'DHS Seasonal Drugs', route: '/SeasonDrugs' },
          { label: 'Growth In Procurment', route: '/GrowthInProcurmentTab' },
          { label: 'Growth in Distribution', route: '/distribution' },
          { label: 'Demand vs Supply', route: '/EdlNonEdlIssuePercentSummary' },
          { label: 'DHS Supplied %', route: '/IssuedPerWise' },
          {
            label: 'DHS Stock Availablity %',
            route: '/StockSummaryBalanceIndent',
          },
          { label: 'WH Indent Pending', route: '/IndentPendingWHdash' },
          { label: 'Warehouse Stock-out %', route: '/StockoutSummary' },

          { label: 'Near Expiry', route: '/nearExpiry' },
          { label: 'NOC', route: '/noc' },
          { label: 'District EDL Counts', route: '/DistrictWiseStk' },
          { label: 'DdlItemWiseInHandQty', route: '/DdlItemWiseInHandQty' },
          { label: 'Stock Position', route: '/DistFACwiseStockPostionNew' },
          {
            label: 'Time-Based Analysis',

            submenu: [
              {
                label: 'Time Taken By Supplier',
                route: '/timetakenBySupplier',
              },
              { label: 'Paid Time Taken', route: '/PaidTimeTaken' },
            ],
            route: '/',
          },
        ],
        EquipmentReagent: [{ label: 'Home', route: '/home' }],
        Infrastructure: [
          { label: 'Verticals', route: '/home' },
          { label: 'Search Work', route: '/SearchingWork' },

          { label: 'Work Abstract', route: '/InfrastructureHome' },
          {
            label: 'Administrative Sanction',
            route: '/AdministrativeSanction',
          },

          { label: 'Live Tender', route: '/LiveTender' },
          { label: 'Evaluation', route: '/TenderEvaluation' },
          { label: 'To be Tender', route: '/ToBeTender' },

          { label: 'Work Order', route: '/WorkOrder' },
          { label: 'Running Works', route: '/RunningWork' },

          { label: 'Land Issues', route: '/LandIssue' },
          { label: 'Technical Sanction', route: '/TechnicalSanction' },
          { label: 'Handover', route: 'Handover' },

          { label: 'Engineer-Works', route: '/EngineerWorks' },
          { label: 'Payment', route: '/PriceEvaluation' },
        ],
      },
    },
    CME: {
      categories: {
        DrugsConsumables: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/cmedash' },
          { label: 'Tender Status', route: '/tender-status-cme' },

          { label: 'Finance', route: '/finance-dash' },
          {
            label: 'Med. Coll/Hospital Indent vs Issuance/NOC',
            route: '/institute-wise-issuance',
          },

          { label: 'Stock Details', route: '/stockDetails' },

          { label: 'Growth in Distribution', route: '/distribution' },

          { label: 'CGMSC TAT For Payment', route: '/PaidTimeTaken' },
          { label: 'QC Time Taken', route: '/QcTimeTaken' },
        ],
        EquipmentReagent: [{ label: 'Home', route: '/home' }],
        Infrastructure: [
          { label: 'Verticals', route: '/home' },
          { label: 'Search Work', route: '/SearchingWork' },

          { label: 'Work Abstract', route: '/InfrastructureHome' },
          {
            label: 'Administrative Sanction',
            route: '/AdministrativeSanction',
          },

          { label: 'Live Tender', route: '/LiveTender' },
          { label: 'Evaluation', route: '/TenderEvaluation' },
          { label: 'To be Tender', route: '/ToBeTender' },

          { label: 'Work Order', route: '/WorkOrder' },
          { label: 'Running Works', route: '/RunningWork' },
        ],
      },
    },
    DME1: {
      categories: {
        DrugsConsumables: [
          { label: 'Home', route: '/home' },
          { label: 'Dashboard', route: '/cmedash' },
          { label: 'Finance', route: '/finance-dash' },

          { label: 'Stock Details', route: '/stockDetails' },

          { label: 'Growth in Distribution', route: '/distribution' },
        ],
        EquipmentReagent: [{ label: 'Home', route: '/home' }],
        Infrastructure: [
          { label: 'Verticals', route: '/home' },
          { label: 'Search Work', route: '/SearchingWork' },

          { label: 'Work Abstract', route: '/InfrastructureHome' },
          {
            label: 'Administrative Sanction',
            route: '/AdministrativeSanction',
          },

          { label: 'Live Tender', route: '/LiveTender' },
          { label: 'Evaluation', route: '/TenderEvaluation' },
          { label: 'To be Tender', route: '/ToBeTender' },

          { label: 'Work Order', route: '/WorkOrder' },
          { label: 'Running Works', route: '/RunningWork' },
        ],
      },
    },

    

    HR: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Dashboard', route: '/admin-dash' },
        { label: 'Attendance', route: '/attendance-dash' },
      ],
    },

    QC: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'QC Insights ', route: '/qc-dashboard' },
        { label: 'Hold Batch History', route: '/holdbatchhistory' },

        { label: 'Stock Details', route: '/stockDetails' },
        { label: 'QC Courier', route: '/QcPendings' },
        { label: 'QC-Lab Issues', route: '/qc-dash' },
      ],
    },
    QC2: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'QC Insights ', route: '/qc-dashboard' },
        { label: 'Hold Batch History', route: '/holdbatchhistory' },

        { label: 'Stock Details', route: '/stockDetails' },
        { label: 'QC Courier', route: '/QcPendings' },
        { label: 'QC-Lab Issues', route: '/qc-dash' },
      ],
    },

    Tenders: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Tender Status', route: '/tender-status' },
        { label: 'Equipment Dashboard', route: '/eqp-dash' },
        { label: 'RCDetail', route: '/Rcdetail' },
        { label: 'IWH Pendings', route: '/iwhPending' },
      ],
    },

    'GM Finance': {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Vendor Registration Completed',
          route: '/VendorRegistrationCompleted',
        },
        {
          label: 'Vendor Registration Approved',
          route: '/VendorRegistrationApproved',
        },
        {
          label: 'Vendor Registration Pending',
          route: '/VRegistrationPending',
        },
      ],
    },

    AdminMoH: {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Vendor Registration Completed',
          route: '/VendorRegistrationCompleted',
        },
        {
          label: 'Vendor Registration Pending',
          route: '/VRegistrationPending',
        },
      ],
    },

    DMFin: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Finance', route: '/finance-dash' },
        { label: 'Growth In Procurment', route: '/GrowthInProcurmentTab' },
        { label: 'Growth in Distribution', route: '/distribution' },
        { label: 'Payment', route: '/PriceEvaluation' },
      ],
    },

    'DM PO': {
      items: [
        { label: 'Home', route: '/home' },
        {
          label: 'Vendor Registration Completed',
          route: '/VendorRegistrationCompleted',
        },
        {
          label: 'Vendor Registration Approved Technical',
          route: '/ApprovalTechnicalCrt',
        },
        {
          label: 'Vendor Registration Pending',
          route: '/VRegistrationPending',
        },
      ],
    },
    Public: {
      items: [
        { label: 'Dashboard', route: '/public-view1' }, // Internal route (keeps routerLink)
        {
          label: 'CGMSC Warehouse Wise Stock',
          route: 'https://dpdmis.in/DPDMISStock/GernalReport/warehouse.aspx',
        },

        { label: 'Health Facilities Coverage', route: '/FacCoveragePublic' },
        {
          label: 'Transport Vehicle Monitoring',
          route: 'https://dpdmis.in/gmapnew.aspx',
        },
        {
          label: 'CGMSC Total Stock',
          route:
            'https://dpdmis.in/DPDMISStock/StockIssue/TotalStock1CGMSCL.aspx',
        },
        {
          label: 'CGMSC Warehouse Stock',
          route:
            'https://dpdmis.in/DPDMISStock/Reports/RptWarehouseStockCGMSCL.aspx',
        },
        {
          label: 'CGMSC Item Wise Stock',
          route:
            'https://dpdmis.in/DPDMISStock/Reports/DrugWisewarehousesrptCGMSCL.aspx',
        },
        {
          label: 'Item Wise Issuance',
          route:
            'https://dpdmis.in/DPDMISStock/FacilityIssue/Cgmsc_Facility_Issue_Summary.aspx',
        },
        {
          label: 'Rate Contract Info',
          route: 'https://dpdmis.in/DPDMISStock/GernalReport/RC_reprot.aspx',
        },
        { label: 'Warehouse Information', route: '/WarehouseInfoPublic' },
      ],
    },
    Infrastructure_Public: {
      items: [
        { label: 'Work Abstract', route: '/Infrastructure-Public-View' },
        { label: 'Search Work', route: '/SearchingWorks' },
        { label: 'Running Works', route: '/RunningWorks' },
        { label: 'Handover', route: '/Handovers' },
      ],
    },

    SE: {
      items: [
        { label: 'Dashboard', route: '/welcome' },

        { label: 'Search Work', route: '/SearchingWork' },
        { label: 'Work Abstract', route: '/InfrastructureHome' },
        { label: 'Administrative Sanction', route: '/AdministrativeSanction' },

        { label: 'Live Tender', route: '/LiveTender' },
        { label: 'Evaluation', route: '/TenderEvaluation' },
        { label: 'To be Tender', route: '/ToBeTender' },

        { label: 'Work Order', route: '/WorkOrder' },
        { label: 'Running Works', route: '/RunningWork' },

        { label: 'Land Issues', route: '/LandIssue' },
        { label: 'Technical Sanction', route: '/TechnicalSanction' },
      ],
    },
    HO_Infra: {
      items: [
        { label: 'Dashboard', route: '/welcome' },

        { label: 'Search Work', route: '/SearchingWork' },
        { label: 'Work Abstract', route: '/InfrastructureHome' },
        { label: 'Administrative Sanction', route: '/AdministrativeSanction' },

        { label: 'Live Tender', route: '/LiveTender' },
        { label: 'Evaluation', route: '/TenderEvaluation' },
        { label: 'To be Tender', route: '/ToBeTender' },

        { label: 'Work Order', route: '/WorkOrder' },
        { label: 'Running Works', route: '/RunningWork' },
      ],
    },

    Warehouse: {
      items: [
        { label: 'Home', route: '/home' },
        { label: 'Warehouse Indent Pending', route: '/IndentPendingWHdash' },
        { label: 'Stock Details', route: '/stockDetails' },
      ],
    },

    Suppliers: {
      items: [
        { label: 'Home', route: '/welcome' },
        {
          label: 'Masters',
          route: '',
          submenu: [
            {
              label: 'Particular Supplier Add',
              route: '/masters/particular-supplier-add',
            },
            {
              label: 'Supplier GST Entry',
              route: '/masters/supplier-gst-entry',
            },
          ],
        },
        { label: 'Stock', route: '', submenu: [] },
        { label: 'Orders', route: '', submenu: [] },
        { label: 'Contracts', route: '', submenu: [] },
        { label: 'Tender', route: '', submenu: [] },
        { label: 'Indents', route: '', submenu: [] },
        { label: 'Reports', route: '', submenu: [] },
        { label: 'Complain', route: '', submenu: [] },
      ],
    },

    Division: {
      items: [
        { label: 'Search Work', route: '/SearchingWork' },
        { label: 'Work Abstract', route: '/InfrastructureHome' },
        { label: 'Administrative Sanction', route: '/AdministrativeSanction' },
        { label: 'Live Tender', route: '/LiveTender' },
        { label: 'Evaluation', route: '/TenderEvaluation' },
      ],
    },
  };

  // Store selected category in localStorage to persist across page refreshes
  setSelectedCategory(
    category:
      | 'DrugsConsumables'
      | 'EquipmentReagent'
      | 'Infrastructure'
      | 'Admin',
  ) {
    this.selectedCategory = category;
    localStorage.setItem('selectedCategory', category); // Save category to localStorage
  }

  // Get the stored category from localStorage or memory
  getSelectedCategory():
    | 'DrugsConsumables'
    | 'EquipmentReagent'
    | 'Infrastructure'
    | 'Admin'
    | undefined {
    if (!this.selectedCategory) {
      // If category is not set in memory, retrieve it from localStorage
      this.selectedCategory = localStorage.getItem('selectedCategory') as
        | 'DrugsConsumables'
        | 'EquipmentReagent'
        | 'Infrastructure'
        | 'Admin'
        | undefined;
    }
    return this.selectedCategory;
  }

  getMenuItems(role: string): {
    label: string;
    route: string;
    submenu?: { label: string; route: string }[];
  }[] {
    const roleMenu = this.menu[role];

    if (!roleMenu) {
      return [];
    }

    const rolesUsingCategories = ['Collector', 'SEC1', 'DHS', 'CME', 'DME1'];

    if (rolesUsingCategories.includes(role) && roleMenu.categories) {
      const selectedCategory = this.getSelectedCategory();
      if (selectedCategory && roleMenu.categories[selectedCategory]) {
        return roleMenu.categories[selectedCategory].map((item) => ({
          ...item,
          submenu: this.getSubmenu(item.label), // Add submenu dynamically if needed
        }));
      }
      return [];
    }

    return roleMenu.items || [];
  }

  // Example submenu provider (optional)
  getSubmenu(label: string): { label: string; route: string }[] | undefined {
    const submenus: any = {
      'Time-Based Analysis': [
        { label: 'Time Taken By Supplier', route: '/timetakenBySupplier' },
        { label: 'Payment Time Taken', route: '/PaidTimeTaken' },
        { label: 'QC Time Taken', route: '/QcTimeTaken' },
        {
          label: 'Door Delivery App Uses',
          route: '/DropAppWarehousePerformance',
        },
      ],

      'Quality Control': [
        { label: 'QC Courier', route: '/QcPendings' },
        { label: 'QC-Lab Issues', route: '/qc-dash' },
      ],
      'Oracle Analytics': [
        { label: 'Tender Status', route: '/oracle-dashboard' },
        { label: 'PO Planning', route: '/po-planning-oracle' },
        { label: 'Near Expiry', route: '/Near-Expiry-Oracle' },
        { label: 'Pipeline Supplies ', route: '/PipelineSuppliesOracle' },
        { label: 'Current Stock', route: '/CurrentStockOracle' },
        { label: 'ABCVEDSDE Analysis', route: '/ABCVEDSDEAnalysisOracle' },
        { label: 'QC Analysis', route: '/QCAnalysisOracle' },
        { label: 'Facility Information', route: '/FacilityInformationOracle' },
      ],
    };
    return submenus[label];
  }
}
