/**
 *  分页
 *
 * Description
 */
var pager = angular.module('pager', []);

pager.directive('penPage', function() {
    return {
        restrict: 'EA',
        templateUrl: '../src/pager.html',
        scope: { conf: '=' },
        link: function($scope, iElm, iAttrs, controller) {
            var conf = $scope.conf;

            // 默认分页长度（为奇数的原因是计算...的显示位置时需要找一个中间点）
            var defaultPagesLength = 9;

            // 默认页面大小范围选择
            var defaultPageSizes = [10, 15, 20, 30, 50]

            // 默认页面大小
            var defaultPageSize = 15;

            //获取分页长度
            if (conf.pagesLength) {
                conf.pagesLength = parseInt(conf.pagesLength);

                if (!conf.pagesLength) {
                    conf.pagesLength = defaultPagesLength
                }

                //分页长度必须为奇数
                if (conf.pagesLength % 2 == 0) {
                    conf.pagesLength += 1;
                }
            } else {
                conf.pagesLength = defaultPagesLength
            }

            //获取页面大小范围
            if (!conf.pageSizes) {
                conf.pageSizes = defaultPageSizes;
            }

            // 获取分页
            function getPage() {

                //获取当前页
                if (conf.currentPage) {
                    conf.currentPage = parseInt(conf.currentPage);
                } else {
                    conf.currentPage = 1;
                }

                //获取总数
                if (conf.totalCount) {
                    conf.totalCount = parseInt(conf.totalCount);
                } else {
                    conf.totalCount = 0;
                    return;
                }

                //获取页面大小
                if (conf.pageSize) {
                    conf.pageSize = parseInt(conf.pageSize);
                } else {
                    conf.pageSize = defaultPageSize;
                }

                //获取总页数
                conf.pageCount = Math.ceil(conf.totalCount / conf.pageSize)


                //计算分页
                conf.pageList = [];

                if (conf.pageCount <= conf.pagesLength) {
                    //总页数<=分页长度
                    for (i = 1; i <= conf.pageCount; i++) {
                        conf.pageList.push(i);
                    }
                } else {
                    //计算显示...的位置（pagesLength中间的下一位）（只在最左边、只在最右边、都显示）
                    var index = Math.ceil(conf.pagesLength / 2)
                    if (conf.currentPage <= index) {
                        //只显示右边
                        for (i = 1; i <= index + 1; i++) {
                            conf.pageList.push(i);
                        }
                        conf.pageList.push('...');
                        conf.pageList.push(conf.pageCount);
                    } else if (conf.currentPage > conf.pageCount - index) {
                        //只显示在左边
                        conf.pageList.push(1);
                        conf.pageList.push('...');
                        for (i = index + 1; i >= 1; i--) {
                            conf.pageList.push(conf.pageCount - i);
                        }
                        conf.pageList.push(conf.pageCount);
                    } else {
                        //都显示
                        conf.pageList.push(1);
                        conf.pageList.push('...');

                        for (i = Math.ceil(index / 2); i >= 1; i--) {
                            conf.pageList.push(conf.currentPage - i);
                        }
                        conf.pageList.push(conf.currentPage);
                        for (i = 1; i <= index / 2; i++) {
                            conf.pageList.push(conf.currentPage + i);
                        }

                        conf.pageList.push('...');
                        conf.pageList.push(conf.pageCount);
                    }
                }
            }

            getPage();

            // 上一页
            $scope.prePage = function() {
                if (conf.currentPage > 1) {
                    conf.currentPage -= 1;
                }
                getPage();
                if (conf.onChange) {
                    conf.onChange();
                }
            };

            // 下一页
            $scope.nextPage = function() {
                if (conf.currentPage < conf.pageCount) {
                    conf.currentPage += 1;
                }
                getPage();
                if (conf.onChange) {
                    conf.onChange();
                }
            };

            // 修改每页大小
            $scope.changePageSize = function() {
                conf.currentPage = 1;
                getPage();

                if (conf.onChange) {
                    conf.onChange();
                }
            }

            // 修改当前页标
            $scope.changePage = function(item) {
                if (item == '...') {
                    return;
                }

                conf.currentPage = item;

                getPage();
                if (conf.onChange) {
                    conf.onChange();
                }
            }

            //跳转
            $scope.jumpPage = function() {
                var num = conf.jumpPage;

                if (num.match(/\d+/)) {
                    num = parseInt(num);

                    if (num && num != conf.currentPage) {

                        if (num > conf.pageCount) {
                            num = conf.pageCount;
                        }

                        conf.currentPage = num;
                        getPage();
                        if (conf.onChange) {
                            conf.onChange();
                        }
                        conf.jumpPageNum = '';

                    }

                }
            }

            //回车跳转
            $scope.jumpPageKeyUp = function(e) {
                var keyCode = window.event ? e.keyCode : e.which;

                if (keyCode == 13) {
                    $scope.jumpPage();
                }
            }
        }
    }
});