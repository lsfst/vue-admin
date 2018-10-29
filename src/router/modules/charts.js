/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noredirect',
  name: 'Charts',
  meta: {
    title: 'charts',
    icon: 'chart'
  },
  children: [
    {
      path: 'keyboard',
      component: () => import('@/views/charts/keyboard'),
      name: 'KeyboardChart',
      meta: { title: 'keyboardChart', noCache: true }
    },
{
    path: 'line',
        component: () => import('@/views/charts/line'),
    name: 'LineChart',
    meta: { title: 'lineChart', noCache: true }
},

{
    path: 'devGrpStatics',
        component: () => import('@/views/nested/menu1/chartIndex'),
    name: 'devGrpStatics',
    redirect: 'noredirect',
    meta: { title: 'devGrpStatics' },
    children: [
        {
            path: 'line',
            component: () => import('@/views/nested/menu1/chartChildIndex'),
            name: 'line',
            meta: { title: 'devGrpLines' },
            children: [
                {
                    path: 'line1',
                    component: () => import('@/views/charts/line'),
                    name: 'line1',
                    meta: { title: 'devGrpData' }
                },
                {
                    path: 'line2',
                    component: () => import('@/views/charts/line2'),
                    name: 'line2',
                    meta: { title: 'devGrpRate' }
                },
                {
                    path: 'line3',
                        component: () => import('@/views/charts/line3'),
                    name: 'line3',
                    meta: { title: 'devGrpNum' }
                }
        ]
},
    {
        path: 'mix',
            component: () => import('@/views/nested/menu1/chartChildIndex'),
        name: 'mix',
        meta: { title: 'devGrpMix' },
        children: [
            {
                path: 'mix1',
                component: () => import('@/views/charts/mixChart'),
                name: 'mix1',
                meta: { title: 'devGrpStatis' }
            },
            {
                path: 'devGrpData2',
                    component: () => import('@/views/charts/mixChart2'),
                name: 'mix2',
                meta: { title: 'devGrpData2' }
            },
            {
                path: 'last30DaysTraffic',
                component: () => import('@/views/charts/mixChart3'),
                name: 'mix3',
                meta: { title: 'last30DaysTraffic' }
            }
    ]
    }
]
},

// {
//     path: 'line2',
//         component: () => import('@/views/charts/line2'),
//     name: 'LineChart2',
//     meta: { title: 'lineChart2', noCache: true }
// },
// {
//     path: 'line3',
//         component: () => import('@/views/charts/line3'),
//     name: 'LineChart3',
//     meta: { title: 'lineChart3', noCache: true }
// },
//     {
//       path: 'mixchart',
//       component: () => import('@/views/charts/mixChart'),
//       name: 'MixChart',
//       meta: { title: 'mixChart', noCache: true }
//     },
// {
//     path: 'mixchart2',
//         component: () => import('@/views/charts/mixChart2'),
//     name: 'MixChart2',
//     meta: { title: 'mixChart2', noCache: true }
// },
// {
//     path: 'mixchart3',
//         component: () => import('@/views/charts/mixChart3'),
//     name: 'MixChart3',
//     meta: { title: 'mixChart3', noCache: true }
// }
  ]
}

export default chartsRouter
