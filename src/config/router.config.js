// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/members/index',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/screen',
        component: RouteView,
        hidden: true,
        meta: {
          title: '数据大屏',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: ['dashboard'],
          target: '_blank'
        }
        // children: [
        //   {
        //     path: 'analysis',
        //     name: 'Analysis',
        //     redirect: '/screen',
        //     // component: () => import('@/views/dashboard/BOSSAnalysis'),
        //     meta: { title: '大屏展示', keepAlive: false, permission: ['dashboard'], target: '_blank' }
        //   }
        //   {
        //     path: 'analysis2',
        //     name: 'Analysis2',
        //     component: () => import('@/views/dashboard/Analysis'),
        //     meta: { title: '分析页', keepAlive: false, permission: ['dashboard'] }
        //   },
        //   // 外部链接
        //   {
        //     path: 'https://www.baidu.com/',
        //     name: 'Monitor',
        //     meta: { title: '监控页（外部）', target: '_blank' }
        //   },
        //   {
        //     path: 'workplace',
        //     name: 'Workplace',
        //     component: () => import('@/views/dashboard/Workplace'),
        //     meta: { title: '工作台', keepAlive: true, permission: ['dashboard'] }
        //   },
        //   {
        //     path: 'test-work',
        //     name: 'TestWork',
        //     component: () => import('@/views/dashboard/TestWork'),
        //     meta: { title: '测试功能', keepAlive: true, permission: ['dashboard'] }
        //   }
        // ]
      },
      {
        path: '/members',
        redirect: '/members/index',
        name: 'members',
        component: PageView,
        meta: { title: '会员管理', icon: bxAnaalyse, permission: [] },
        children: [
          {
            path: '/members/saleman',
            name: 'Saleman',
            component: () => import('@/views/members/Saleman'),
            meta: { title: '分销员', keepAlive: true, permission: [] }
          },
          {
            path: '/members/index',
            name: 'MemberIndex',
            component: () => import('@/views/members/Index'),
            meta: { title: '会员', keepAlive: true, permission: [] }
          },
          {
            path: '/members/shopkeeper',
            name: 'shopkeeper',
            component: () => import('@/views/members/shopkeeper'),
            meta: { title: '掌柜', keepAlive: true, permission: [] }
          },
          {
            path: '/members/shopkeeper/pwList',
            name: 'pwList',
            hidden: true,
            component: () => import('@/views/members/pwList'),
            meta: { title: '管理口令', keepAlive: true, permission: [] }
          }
        ]
      },
      {
        path: '/orders',
        redirect: '/orders/index',
        name: 'orders',
        component: PageView,
        meta: { title: '订单', icon: bxAnaalyse, permission: [] },
        children: [
          {
            path: '/orders/index',
            name: 'OrdersIndex',
            component: () => import('@/views/orders/Index'),
            meta: { title: '订单管理', keepAlive: true, permission: [] }
          },
          {
            path: '/orders/:id',
            name: 'OrdersShow',
            hidden: true,
            component: () => import('@/views/orders/Show'),
            meta: { title: '订单详情', keepAlive: true, permission: [] }
          },
          {
            path: '/orders/sales/:id',
            name: 'OrdersSalesShow',
            hidden: true,
            component: () => import('@/views/orders/SalesShow'),
            meta: { title: '订单详情', keepAlive: true, hiddenHeaderContent: true, permission: [] }
          },
          {
            path: '/after-sale/orders',
            name: 'AfterSale',
            component: () => import('@/views/orders/AfterSale'),
            meta: { title: '售后管理', keepAlive: true, permission: [] }
          }
        ]
      },
      {
        path: '/products/index',
        redirect: '/products',
        name: 'products',
        component: PageView,
        meta: { title: '商品管理', icon: bxAnaalyse, permission: [] },
        children: [
          {
            path: '/products/edit',
            name: 'ProductsEdit',
            component: () => import('@/views/products/Edit'),
            meta: { title: '发布新商品', keepAlive: false, permission: [] }
          },
          {
            path: '/products',
            name: 'ProductsIndex',
            component: () => import('@/views/products/Index'),
            meta: { title: '商品列表', keepAlive: true, permission: [] }
          },
          {
            path: '/products/:id',
            name: 'ProductsUpdate',
            component: () => import('@/views/products/Edit'),
            hidden: true,
            meta: { title: '商品编辑', keepAlive: true, permission: [] }
          }
        ]
      },
      {
        path: '/categories/index',
        redirect: '/categories',
        name: 'categories',
        component: PageView,
        meta: { title: process.env.VUE_APP_PROJECT_NAME + '页面管理', icon: bxAnaalyse, permission: [] },
        children: [
          {
            path: '/categories',
            name: 'CategoriesIndex',
            component: () => import('@/views/categories/Index'),
            meta: { title: '分类管理', keepAlive: true, permission: [] }
          },
          {
            path: '/categories/:id/products',
            name: 'CategoriesProducts',
            component: () => import('@/views/categories/Products'),
            hidden: true,
            meta: { title: '分类商品', keepAlive: true, permission: [] }
          },
          {
            path: '/banners',
            name: 'BannersIndex',
            component: () => import('@/views/banners/Index'),
            meta: { title: 'Banner 设置', keepAlive: true, permission: [] }
          },
          {
            path: '/banners-homaho',
            name: 'BannersHomaho',
            component: () => import('@/views/banners/homahoIndex'),
            meta: { title: 'Banners 设置', keepAlive: true, permission: [] }
          }
        ]
      },
      {
        path: '/finance',
        redirect: '/finance',
        name: 'finance',
        component: PageView,
        meta: { title: '财务管理', icon: bxAnaalyse, permission: [] },
        children: [
          {
            path: '',
            name: 'FinanceIndex',
            component: () => import('@/views/finance/Index'),
            meta: { title: '钱包明细', keepAlive: true, permission: [] }
          },
          {
            path: 'pending',
            name: 'FinancePending',
            hidden: true,
            component: () => import('@/views/finance/pending'),
            meta: { title: '待入账明细表', keepAlive: true, permission: [], hiddenHeaderContent: true }
          },
          {
            path: 'record',
            name: 'FinanceRecord',
            component: () => import('@/views/finance/record'),
            meta: { title: '提现记录', keepAlive: true, permission: [] }
          },
          {
            path: 'bills',
            name: 'FinanceBills',
            component: () => import('@/views/finance/Bills'),
            meta: { title: '交易对账表', keepAlive: true, permission: [] }
          }
        ]
      },
      {
        path: '/folder',
        redirect: '/folder',
        name: 'folder',
        component: PageView,
        meta: { title: '供货市场', icon: bxAnaalyse, permission: [] },
        children: [
          {
            path: '',
            name: 'FolderIndex',
            component: () => import('@/views/folder/index'),
            meta: { title: '供货列表', keepAlive: true, permission: [] }
          },
          {
            path: '/folder/omsClassify',
            name: 'OmsClassify',
            component: () => import('@/views/folder/oms-classify'),
            meta: { title: '批量选择商品', keepAlive: true, permission: [] }
          },
          {
            path: '/OmsBrand/:id',
            name: 'OmsBrand',
            hidden: true,
            component: () => import('@/views/folder/oms-brand'),
            meta: { title: '选择品牌', keepAlive: true, permission: [] }
          },
          {
            path: '/folder/omsGoods',
            name: 'OmsGoods',
            hidden: true,
            component: () => import('@/views/folder/oms-goods'),
            meta: { title: '设置商品', keepAlive: true, permission: [] }
          },
          {
            path: '/folder/:id',
            name: 'FolderDetail',
            hidden: true,
            component: () => import('@/views/folder/detail'),
            meta: { title: '商品详情', keepAlive: true, permission: [] }
          }

        ]
      }
    ]
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/dashboard/Screen'),
    meta: { title: '大屏', keepAlive: false, permission: ['dashboard'] }
  },
  {
    path: '/meshes',
    name: 'meshes',
    hidden: true,
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Meshes')
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'editPW',
        name: 'editPW',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/editPassWord')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },

      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
