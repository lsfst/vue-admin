/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/dragTable'),
      name: 'DragTable',
      meta: { title: 'dragTable' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inlineEditTable'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      path: 'tree-table',
      component: () => import('@/views/table/treeTable/treeTable'),
      name: 'TreeTableDemo',
      meta: { title: 'treeTable' }
    },
    {
      path: 'custom-tree-table',
      component: () => import('@/views/table/treeTable/customTreeTable'),
      name: 'CustomTreeTableDemo',
      meta: { title: 'customTreeTable' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complexTable'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    },
{
    path: 'agent-table',
        component: () => import('@/views/table/customTable/agentTable'),
    name: 'agentTable',
    meta: { title: 'agentTable' }
},
// {
//     path: 'tabletest',
//         component: () => import('@/views/table/customTable/tabletest'),
//         name: 'tabletest',
//         meta: { title: 'tabletest' }
// },
{
    path: 'packageDaily-table',
        component: () => import('@/views/table/customTable/packageDailyTable'),
    name: 'packageDailyTable',
    meta: { title: 'packageDailyTable' }
}
,
{
    path: 'packageMonthly-table',
        component: () => import('@/views/table/customTable/packageMonthlyTable'),
    name: 'packageMonthlyTable',
    meta: { title: 'packageMonthlyTable' }
}
,
{
    path: 'vifiDev-table',
        component: () => import('@/views/table/customTable/vifiDevTable'),
    name: 'vifiDevTable',
    meta: { title: 'vifiDevTable' }
},
{
    path: 'vifiDevGrp-table',
        component: () => import('@/views/table/customTable/vifiDevGrpTable'),
    name: 'vifiDevGrpTable',
    meta: { title: 'vifiDevGrpTable' }
}
,
{
    path: 'vifiDevAction-table',
        component: () => import('@/views/table/customTable/vifiDevActionTable'),
    name: 'vifiDevActionTable',
    meta: { title: 'vifiDevActionTable' }
}
,
{
    path: 'vifiDevCmd-table',
        component: () => import('@/views/table/customTable/vifiDevCmdTable'),
    name: 'vifiDevCmdTable',
    meta: { title: 'vifiDevCmdTable' }
},
{
    path: 'simcard-table',
        component: () => import('@/views/table/customTable/simCardTable'),
    name: 'simCardTable',
    meta: { title: 'simCardTable' }
},
{
    path: 'simGrp-table',
        component: () => import('@/views/table/customTable/simGrpTable'),
    name: 'simGrpTable',
    meta: { title: 'simGrpTable' }
},
{
    path: 'simSales-table',
        component: () => import('@/views/table/customTable/simSalesTable'),
        name: 'simSalesTable',
        meta: { title: 'simSalesTable' }
},
{
    path: 'simPDev-table',
        component: () => import('@/views/table/customTable/simPDevTable'),
        name: 'simPDevTable',
        meta: { title: 'simPDevTable' }
},
{
    path: 'simPDevGrp-table',
        component: () => import('@/views/table/customTable/simPDevGrpTable'),
    name: 'simPDevGrpTable',
    meta: { title: 'simPDevGrpTable' }
},
{
    path: 'simPDevAction-table',
        component: () => import('@/views/table/customTable/simPDevActionTable'),
    name: 'simPDevActionTable',
    meta: { title: 'simPDevActionTable' }
},
{
    path: 'devDaily-table',
        component: () => import('@/views/table/customTable/devDailyTable'),
    name: 'devDailyTable',
    meta: { title: 'devDailyTable' }
},
{
    path: 'devMonthly-table',
        component: () => import('@/views/table/customTable/devMonthlyTable'),
    name: 'devMonthlyTable',
    meta: { title: 'devMonthlyTable' }
},
{
    path: 'simDaily-table',
        component: () => import('@/views/table/customTable/simDailyTable'),
    name: 'simDailyTable',
    meta: { title: 'simDailyTable' }
},
{
    path: 'simMonthly-table',
        component: () => import('@/views/table/customTable/simMonthlyTable'),
    name: 'simMonthlyTable',
    meta: { title: 'simMonthlyTable' }
},
{
    path: 'cdr-table',
        component: () => import('@/views/table/customTable/cdrTable'),
    name: 'cdrTable',
    meta: { title: 'cdrTable' }
},
{
    path: 'globalSim-table',
        component: () => import('@/views/table/customTable/globalSimTable'),
    name: 'globalSim',
    meta: { title: 'globalSim' }
},
{
    path: 'globalSimGrp-table',
        component: () => import('@/views/table/customTable/globalSimGrpTable'),
    name: 'globalSimGrp',
    meta: { title: 'globalSimGrp' }
},
  ]
}
export default tableRouter
